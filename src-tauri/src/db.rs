use std::{path::PathBuf, sync::OnceLock};

use ollama_lab_db_desktop::load_migrations;
use sqlx::{pool::PoolConnection, Sqlite, SqlitePool};

use crate::{error::Error, paths::local_data_dir};

static POOL: OnceLock<SqlitePool> = OnceLock::new();

pub async fn get_connection() -> Result<PoolConnection<Sqlite>, Error> {
    if let Some(pool) = POOL.get() {
        Ok(pool.acquire().await?)
    } else {
        Err(Error::StaticSync)
    }
}

pub async fn load_connection() -> Result<(), Error> {
    POOL.set({
        let addr = {
            db_file()?
                .to_str()
                .map(|s| s.to_string())
                .ok_or_else(|| Error::NoDataPath)?
        };

        SqlitePool::connect(format!("sqlite:{}", addr).as_str()).await?
    })
    .map_err(|_| Error::NoDataPath)?;

    Ok(())
}

pub fn db_file() -> Result<PathBuf, Error> {
    local_data_dir()
        .map(|mut dir| {
            dir.push("data.sqlite");
            dir
        })
        .ok_or_else(|| Error::NoDataPath)
}

pub async fn create_db_file() -> Result<tokio::fs::File, Error> {
    let path = db_file()?;

    if let Some(parent) = path.parent() {
        tokio::fs::create_dir_all(parent).await?;
    }

    Ok(tokio::fs::File::create_new(path).await?)
}

pub async fn update_database() -> Result<(), Error> {
    load_migrations(&mut *get_connection().await?)
        .await
        .map_err(|err| sqlx::Error::Migrate(Box::new(err)))?;

    Ok(())
}
