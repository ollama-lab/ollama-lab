pub use diesel;
pub use diesel_migrations;

use diesel::{sqlite::Sqlite, Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use error::Error;

pub mod schema;
pub mod error;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn load_connection(url: &str) -> Result<SqliteConnection, Error> {
    SqliteConnection::establish(url).map_err(|_| Error::Connection)
}

pub fn run_migrations(conn: &mut impl MigrationHarness<Sqlite>) -> Result<(), Error> {
    conn.run_pending_migrations(MIGRATIONS)
        .map_err(|_| Error::Migration)?;

    Ok(())
}
