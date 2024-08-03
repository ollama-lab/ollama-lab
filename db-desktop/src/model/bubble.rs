use std::str::FromStr;

use chrono::{DateTime, Local};
use sqlx::SqliteExecutor;

use super::Role;

#[derive(sqlx::FromRow)]
pub struct Bubble {
    id: i32,
    session: i32,
    role: String,
    content: String,
    date_created: DateTime<Local>,
    is_edited: bool,
}

impl Bubble {
    #[inline]
    pub fn id(&self) -> i32 {
        self.id
    }

    #[inline]
    pub fn session(&self) -> i32 {
        self.session
    }

    #[inline]
    pub fn role(&self) -> Role {
        Role::from_str(self.role.as_str())
            .unwrap_or_else(|_| unreachable!())
    }

    #[inline]
    pub fn content(&self) -> &str {
        self.content.as_str()
    }

    #[inline]
    pub fn date_created(&self) -> &DateTime<Local> {
        &self.date_created
    }

    #[inline]
    pub fn is_edited(&self) -> bool {
        self.is_edited
    }

    pub async fn from_id(exec: impl SqliteExecutor<'_>, id: i32) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM bubbles WHERE id = $1")
            .bind(id)
            .fetch_one(exec)
            .await
    }

    pub async fn from_session(exec: impl SqliteExecutor<'_>, session_id: i32) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as::<_, Self>("SELECT * FROM bubbles WHERE session = $1")
            .bind(session_id)
            .fetch_all(exec)
            .await
    }

    pub async fn update_content_by_id(exec: impl SqliteExecutor<'_> + Clone, id: i32, content: &str) -> Result<Vec<Self>, sqlx::Error> {
        let bubble = sqlx::query_as::<_, Self>(r#"
            UPDATE bubbles
            SET content = $1
            WHERE id = $2
            RETURNING *
        "#).bind(content).bind(id)
            .fetch_one(exec.clone())
            .await?;

        sqlx::query_as::<_, Self>(r#"
            SELECT *
            FROM bubbles
            WHERE session = $1 AND id <= $2
            ORDER BY id ASC
        "#).bind(bubble.session()).bind(id)
            .fetch_all(exec)
            .await
    }

    pub async fn update_content(&mut self, exec: impl SqliteExecutor<'_>, id: i32, content: &str) -> Result<(), sqlx::Error> {
        let bubble = sqlx::query_as::<_, Self>(r#"
            UPDATE bubbles
            SET content = $1
            WHERE id = $2
            RETURNING *
        "#).bind(content).bind(id)
            .fetch_one(exec)
            .await?;

        self.content = bubble.content().to_string();
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

    pub async fn save_into(self, exec: impl SqliteExecutor<'_>) -> Result<Bubble, sqlx::Error> {
        sqlx::query_as::<_, Bubble>(r#"
            INSERT INTO bubbles(session, role, content)
            VALUES ($1, $2, $3)
            RETURNING *
        "#).bind(self.session).bind(self.role).bind(self.content)
            .fetch_one(exec)
            .await
    }
}
