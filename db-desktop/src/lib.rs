pub use sqlx;
use sqlx::SqliteConnection;

pub mod model;

pub async fn load_migrations(migrator: &mut SqliteConnection) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!()
        .run(migrator)
        .await
}
