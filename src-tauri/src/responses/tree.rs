use models::NewChildNode;
use sqlx::{Connection, SqliteConnection};

use crate::{errors::Error, models::chat::Chat};

pub mod models;

/// Abstraction of the chat history as a tree
///
/// When user change a submitted prompt, a new branch is created
/// for storing the interactions based on the new version of prompt.
/// The new prompt is a sibling node of the old one with the same
/// parent (i.e. previous prompt/generation).
pub struct ChatTree {
    session_id: i64,
    conn: SqliteConnection,
}

impl ChatTree {
    #[must_use]
    pub fn new(session_id: i64, conn: SqliteConnection) -> Self {
        Self{ session_id, conn }
    }

    pub fn session_id(&self) -> i64 {
        self.session_id
    }

    pub async fn current_branch(&mut self) -> Result<Vec<Chat>, Error> {
        Ok(
            sqlx::query_as::<_, Chat>("\
                WITH RECURSIVE rec_chats (id, session_id, role, content, completed, date_created, date_edited, model, parent_id, priority)
                AS (
                    SELECT id, session_id, role, content, completed, date_created, date_edited, model, parent_id, priority
                    FROM chats
                    WHERE session_id = $1 AND parent_id = NULL
                    ORDER BY priority DESC, date_created
                    LIMIT 1
                    UNION
                    SELECT
                        c1.id, c1.session_id, c1.role, c1.content, c1.completed, c1.date_created,
                        c1.date_edited, c1.model, c1.parent_id, c1.priority
                    FROM chats AS c1, rec_chats
                    WHERE c1.session_id = $1, c1.parent_id = rec_chats.id
                    ORDER BY c1.priority DESC, c1.date_created
                    LIMIT 1
                )
                SELECT *
                FROM rec_chats;
            ")
                .bind(self.session_id)
                .fetch_all(&mut self.conn)
                .await?
        )
    }

    pub async fn new_sibling(&mut self, chat_id: i64, new_content: Option<String>) -> Result<i64, Error> {
        let mut tx = self.conn.begin().await?;

        sqlx::query("\
            UPDATE chats
            SET priority = 0
            WHERE
                session_id = $1
                AND
                parent_id = (SELECT parent_id FROM chats WHERE id = $2);
        ")
            .bind(self.session_id).bind(chat_id)
            .execute(&mut *tx)
            .await?;

        let new_chat = sqlx::query_as::<_, (i64,)>("\
            INSERT INTO chats (session_id, role, content, model, parent_id, priority)
            SELECT c.session_id, c.role, IFNULL(input_t.content, c.content) AS content, c.model, c.parent_id, 1
            FROM (
                VALUES ($2, $3)
            ) AS input_t (id, content)
            INNER JOIN chats c ON input_t.id = c.id
            WHERE c.session_id = $1
            RETURNING id
        ")
            .bind(self.session_id).bind(chat_id).bind(new_content)
            .fetch_one(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(new_chat.0)
    }

    pub async fn new_child(&mut self, chat_id: i64, create_info: NewChildNode) -> Result<i64, Error> {
        let mut tx = self.conn.begin().await?;

        sqlx::query("\
            UPDATE chats
            SET priority = 0
            WHERE session_id = $1 AND parent_id = $2;
        ")
            .bind(self.session_id).bind(chat_id)
            .execute(&mut *tx)
            .await?;

        let new_chat = sqlx::query_as::<_, (i64,)>("\
            INSERT INTO chats (session_id, role, content, model, parent_id, priority)
            VALUES ($1, $2, $3, $4, $5, 1)
            RETURNING id;
        ")
            .bind(self.session_id)
            .bind(create_info.role.to_string())
            .bind(create_info.content)
            .bind(create_info.model)
            .bind(chat_id)
            .fetch_one(&mut *tx)
            .await?;

        tx.commit().await?;

        Ok(new_chat.0)
    }

    pub async fn set_default(&mut self, chat_id: i64) -> Result<(), Error> {
        let affected = sqlx::query("\
            UPDATE chats
            SET = IF(id = $1, 1, 0)
            WHERE parent_id = (SELECT parent_id FROM chats WHERE id = $1);
        ")
            .bind(chat_id)
            .execute(&mut self.conn)
            .await?
            .rows_affected();

        (affected > 0)
            .then_some(())
            .ok_or(Error::NotExists)
    }

    pub async fn delete_session(mut self) -> Result<(), Error> {
        let affected = sqlx::query("\
            DELETE FROM sessions
            WHERE id = $1;
        ")
            .bind(self.session_id)
            .execute(&mut self.conn)
            .await?
            .rows_affected();

        (affected > 0)
            .then_some(())
            .ok_or(Error::NotExists)
    }

    pub async fn delete_tree(&mut self, chat_id: i64) -> Result<(), Error> {
        let affected = sqlx::query("\
            DELETE FROM chats
            WHERE session_id = $1 AND id = $2;
        ")
            .bind(self.session_id).bind(chat_id)
            .execute(&mut self.conn)
            .await?
            .rows_affected();

        (affected > 0)
            .then_some(())
            .ok_or(Error::NotExists)
    }
}
