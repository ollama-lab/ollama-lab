use models::NewChildNode;
use sqlx::{Executor, Sqlite, Transaction};

use crate::{errors::Error, image::{get_compressed_image, MODEL_IMAGE_SIZE}, models::chat::Chat};

pub mod models;

/// Abstraction of the chat history as a tree
///
/// When user changes an existing prompt, a new branch is created
/// for storing the interactions based on the new version of prompt.
/// The new prompt is a sibling node of the old one with the same
/// parent (i.e. previous prompt/generation).
pub struct ChatTree {
    session_id: i64,
}

impl ChatTree {
    #[must_use]
    pub fn new(session_id: i64) -> Self {
        Self { session_id }
    }

    pub fn session_id(&self) -> i64 {
        self.session_id
    }

    pub async fn current_branch(
        &self,
        executor: impl Executor<'_, Database = Sqlite>,
        parent_id: Option<i64>,
        completed_only: bool,
    ) -> Result<Vec<Chat>, Error> {
        Ok(
            sqlx::query_as::<_, Chat>(r#"
                WITH RECURSIVE rec_chats (
                    id, session_id, role, content, image_count, completed, date_created, date_edited, model, parent_id, priority,
                    thoughts, thought_for
                )
                AS (
                    SELECT *
                    FROM (
                        SELECT
                            id, session_id, role, content, image_count, completed, date_created, date_edited, model, parent_id, priority,
                            thoughts, thought_for
                        FROM v_complete_chats
                        WHERE
                            session_id = $1
                            AND parent_id IS $2
                            AND ($3 IS NULL OR completed = $3)
                        ORDER BY priority DESC, date_created
                        LIMIT 1
                    )
                    UNION
                    SELECT
                        c1.id, c1.session_id, c1.role, c1.content, c1.image_count, c1.completed, c1.date_created,
                        c1.date_edited, c1.model, c1.parent_id, c1.priority, c1.thoughts, c1.thought_for
                    FROM v_complete_chats AS c1, rec_chats
                    WHERE c1.session_id = $1
                        AND c1.parent_id = rec_chats.id
                        AND c1.id IN (
                            SELECT id FROM (
                                SELECT c2.id, MAX(c2.priority)
                                FROM chats AS c2
                                GROUP BY c2.parent_id
                            )
                        )
                        AND ($3 IS NULL OR c1.completed = $3)
                )
                SELECT *
                FROM rec_chats;
            "#)
                .bind(self.session_id).bind(parent_id).bind(if completed_only { Some(true) } else { None })
                .fetch_all(executor)
                .await?
        )
    }

    pub async fn new_sibling(
        &self,
        tx: &mut Transaction<'_, Sqlite>,
        chat_id: i64,
        new_content: Option<&str>,
        completed: Option<bool>,
        model: Option<&str>,
    ) -> Result<i64, Error> {
        sqlx::query(
            r#"
            UPDATE chats
            SET priority = 0
            WHERE
                session_id = $1
                AND
                parent_id IN (SELECT parent_id FROM chats WHERE id = $2);
        "#,
        )
        .bind(self.session_id)
        .bind(chat_id)
        .execute(&mut **tx)
        .await?;

        let new_chat = sqlx::query_as::<_, (i64,)>(
            r#"
            INSERT INTO chats (session_id, role, content, parent_id, completed, priority)
            SELECT session_id, role, IFNULL($3, content), parent_id, $4, 1
            FROM chats
            WHERE session_id = $1 AND id = $2
            RETURNING id;
        "#,
        )
        .bind(self.session_id)
        .bind(chat_id)
        .bind(new_content)
        .bind(completed.unwrap_or(true))
        .fetch_one(&mut **tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO chat_models (chat_id, model)
            SELECT $1, IFNULL($3, model)
            FROM chat_models
            WHERE chat_id = $2;
        "#,
        )
        .bind(new_chat.0)
        .bind(chat_id)
        .bind(model)
        .execute(&mut **tx)
        .await?;

        Ok(new_chat.0)
    }

    /// Create new child
    ///
    /// ## Returns
    ///
    /// (i64, i64): (node id, timestamp)
    pub async fn new_child(
        &self,
        tx: &mut Transaction<'_, Sqlite>,
        parent_id: Option<i64>,
        create_info: NewChildNode<'_, '_, '_>,
    ) -> Result<(i64, i64), Error> {
        sqlx::query(
            r#"
            UPDATE chats
            SET priority = 0
            WHERE session_id = $1 AND parent_id IS $2;
        "#,
        )
        .bind(self.session_id)
        .bind(parent_id)
        .execute(&mut **tx)
        .await?;

        let ret = sqlx::query_as::<_, (i64, i64)>(
            r#"
            INSERT INTO chats (session_id, role, content, parent_id, completed, priority)
            VALUES ($1, $2, $3, $4, $5, 1)
            RETURNING id, date_created;
        "#,
        )
        .bind(self.session_id)
        .bind(create_info.role.to_string())
        .bind(create_info.content)
        .bind(parent_id)
        .bind(create_info.completed)
        .fetch_one(&mut **tx)
        .await?;

        if let Some(model) = create_info.model {
            sqlx::query(
                r#"
                INSERT INTO chat_models (chat_id, model)
                VALUES ($1, $2);
            "#,
            )
            .bind(ret.0)
            .bind(model)
            .execute(&mut **tx)
            .await?;
        }

        if let Some(images) = create_info.images {
            for image_path in images.into_iter() {
                let image = get_compressed_image(image_path, MODEL_IMAGE_SIZE)?.into_bytes();

                sqlx::query(r#"
                    INSERT INTO prompt_images (chat_id, origin, image)
                    VALUES ($1, $2, $3);
                "#)
                    .bind(ret.0).bind(image_path).bind(image)
                    .execute(&mut **tx)
                    .await?;
            }
        }

        Ok(ret)
    }

    pub async fn set_default(
        &self,
        executor: impl Executor<'_, Database = Sqlite>,
        chat_id: i64,
    ) -> Result<(), Error> {
        let affected = sqlx::query(
            "\
            UPDATE chats
            SET priority = CASE
                WHEN id = $1 THEN 1
                ELSE 0
            END
            WHERE session_id = $2 AND parent_id IS (SELECT parent_id FROM chats WHERE id = $1);
        ",
        )
        .bind(chat_id)
        .bind(self.session_id)
        .execute(executor)
        .await?
        .rows_affected();

        (affected > 0).then_some(()).ok_or(Error::NotExists)
    }

    pub async fn delete_session(
        self,
        executor: impl Executor<'_, Database = Sqlite>,
    ) -> Result<(), Error> {
        let affected = sqlx::query(
            "\
            DELETE FROM sessions
            WHERE id = $1;
        ",
        )
        .bind(self.session_id)
        .execute(executor)
        .await?
        .rows_affected();

        (affected > 0).then_some(()).ok_or(Error::NotExists)
    }

    pub async fn delete_tree(
        &mut self,
        executor: impl Executor<'_, Database = Sqlite> + Clone,
        chat_id: i64,
    ) -> Result<(), Error> {
        let affected = sqlx::query(
            "\
            DELETE FROM chats
            WHERE session_id = $1 AND id = $2;
        ",
        )
        .bind(self.session_id)
        .bind(chat_id)
        .execute(executor)
        .await?
        .rows_affected();

        (affected > 0).then_some(()).ok_or(Error::NotExists)
    }
}
