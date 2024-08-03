pub use sqlx;
use sqlx::{Connection, SqliteConnection};

pub mod model;

pub async fn load_connection(url: &str) -> Result<SqliteConnection, sqlx::Error> {
    SqliteConnection::connect(url).await
}

pub async fn load_migrations(conn: &mut SqliteConnection) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!()
        .run(conn)
        .await
}
