use chrono::{DateTime, Local};
use sqlx::SqliteConnection;

#[derive(sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub password: Option<String>,
    pub is_default: bool,
    pub date_created: DateTime<Local>,
}

impl User {
    pub async fn try_default(conn: &mut SqliteConnection) -> Result<User, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE is_default = TRUE AND id = 'default' LIMIT 1")
            .fetch_one(&mut *conn)
            .await
    }
}
