use std::str::FromStr;

use chrono::{DateTime, Local};
use serde::Serialize;
use sqlx::SqliteConnection;

use super::Role;

#[derive(sqlx::FromRow, Clone, Serialize)]
pub struct Bubble {
    pub id: i32,
    pub session: i32,
    role: String,
    pub content: String,
    pub date_created: DateTime<Local>,
    pub is_edited: bool,
}

impl Bubble {
    #[inline]
    pub fn role(&self) -> Role {
        Role::from_str(self.role.as_str())
            .unwrap_or_else(|_| unreachable!())
    }

    pub async fn from_id(conn: &mut SqliteConnection, id: i32) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM bubbles WHERE id = $1")
            .bind(id)
            .fetch_one(&mut *conn)
            .await
    }

    pub async fn from_session(conn: &mut SqliteConnection, session_id: i32) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM bubbles WHERE session = $1")
            .bind(session_id)
            .fetch_all(&mut *conn)
            .await
    }

    pub async fn update_content_by_id(conn: &mut SqliteConnection, id: i32, content: &str) -> Result<Vec<Self>, sqlx::Error> {
        let bubble = sqlx::query_as::<_, Self>(r#"
            UPDATE bubbles
            SET content = $1, is_edited = TRUE
            WHERE id = $2
            RETURNING *
        "#).bind(content).bind(id)
            .fetch_one(&mut *conn)
            .await?;

        sqlx::query_as::<_, Self>(r#"
            SELECT *
            FROM bubbles
            WHERE session = $1 AND id <= $2
            ORDER BY id ASC
        "#).bind(bubble.session).bind(id)
            .fetch_all(&mut *conn)
            .await
    }

    pub async fn update_content(&mut self, conn: &mut SqliteConnection, content: &str) -> Result<(), sqlx::Error> {
        let bubble = sqlx::query_as::<_, Self>(r#"
            UPDATE bubbles
            SET content = $1, is_edited = TRUE
            WHERE id = $2
            RETURNING *
        "#).bind(content).bind(self.id)
            .fetch_one(&mut *conn)
            .await?;

        self.content = bubble.content;
        Ok(())
    }
}

pub struct NewBubble<'a> {
    session: i32,
    role: &'a str,
    content: &'a str,
}

impl<'a> NewBubble<'a> {
    #[must_use]
    #[inline]
    pub fn new(session: i32, role: Role, content: &'a str) -> Self {
        Self { session, role: role.into(), content }
    }

    pub async fn save_into(self, conn: &mut SqliteConnection) -> Result<(), sqlx::Error> {
        sqlx::query(r#"
            INSERT INTO bubbles(session, role, content)
            VALUES ($1, $2, $3)
        "#).bind(self.session).bind(self.role).bind(self.content)
            .execute(&mut *conn)
            .await?;

        Ok(())
    }

    pub async fn save_into_returning(self, conn: &mut SqliteConnection) -> Result<Bubble, sqlx::Error> {
        sqlx::query_as::<_, Bubble>(r#"
            INSERT INTO bubbles(session, role, content)
            VALUES ($1, $2, $3)
            RETURNING *
        "#).bind(self.session).bind(self.role).bind(self.content)
            .fetch_one(&mut *conn)
            .await
    }
}
