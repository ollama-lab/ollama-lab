use std::{ops::Not, path::PathBuf, sync::OnceLock};

use crate::{error::Error, paths::local_data_dir};

pub(crate) static DB_URL: OnceLock<String> = OnceLock::new();

pub fn db_file() -> Result<PathBuf, Error> {
    local_data_dir()
        .map(|mut dir| {
            dir.push("db.sqlite");
            dir
        })
        .ok_or_else(|| Error::NoDataPath)
}

pub fn load_db_url(transient_mode: bool) -> Result<(), Error> {
    DB_URL.set(if transient_mode {
        ":memory:".to_string()
    } else {
        db_file()?
            .to_str()
            .map(|s| s.to_string())
            .ok_or_else(|| Error::NoDataPath)?
    })
    .map_err(|_| Error::StaticSync)?;

    Ok(())
}

pub fn auto_load_db_url() -> Result<(), Error> {
    load_db_url(db_file()?.try_exists().map_err(|_| Error::AccessDenied)?.not())?;

    Ok(())
}

pub fn create_db_file_sync() -> Result<std::fs::File, Error> {
    let file = std::fs::File::create_new(db_file()?)?;

    Ok(file)
}

pub async fn create_db_file() -> Result<tokio::fs::File, Error> {
    let file = tokio::fs::File::create_new(db_file()?).await?;

    Ok(file)
}
