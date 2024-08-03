use chrono::{DateTime, Local};
use sqlx::SqliteExecutor;

#[derive(sqlx::FromRow)]
pub struct User {
    id: String,
    password: Option<String>,
    is_default: bool,
    date_created: DateTime<Local>,
}

impl User {
    #[inline]
    pub fn id(&self) -> &str {
        self.id.as_str()
    }

    #[inline]
    pub fn password(&self) -> Option<&str> {
        self.password.as_ref().map(|s| s.as_str())
    }

    #[inline]
    pub fn is_default(&self) -> bool {
        self.is_default
    }

    #[inline]
    pub fn date_created(&self) -> &DateTime<Local> {
        &self.date_created
    }

    pub async fn try_default(exec: impl SqliteExecutor<'_>) -> Result<User, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE is_default = TRUE AND id = 'default' LIMIT 1")
            .fetch_one(exec)
            .await
    }
}
