use std::fmt::Display;

use ollama_rest::models::errors::ParsingError;
use serde::Serialize;
use sqlx::migrate::MigrateError;

use crate::settings;

#[derive(Debug)]
pub enum Error {
    AccessDenied,
    Api(ollama_rest::errors::Error),
    DbQuery(sqlx::Error),
    Io(std::io::ErrorKind),
    NoConnection,
    NoDataPath,
    Settings(settings::error::Error),
    StaticSync,
    Tauri(tauri::Error),
    Migration(MigrateError),
    ChanSend,
    NotExists,
    InvalidRole,
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cache: Option<String>;
        write!(
            f,
            "{}",
            match self {
                Self::Api(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::Settings(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::NoDataPath => "No data path",
                Self::StaticSync => "Static syncing failed",
                Self::AccessDenied => "Access denied",
                Self::Io(err_kind) => {
                    cache = Some(format!("{:?}", err_kind));
                    cache.as_ref().unwrap().as_str()
                }
                Self::DbQuery(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::Tauri(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::Migration(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::NoConnection => "Ollama Lab is not connected to the app database.",
                Self::ChanSend => "Error occurred during channel sending.",
                Self::NotExists => "Not exists",
                Self::InvalidRole => "Invalid prompt role",
            }
        )
    }
}

impl std::error::Error for Error {}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

impl From<settings::error::Error> for Error {
    fn from(value: settings::error::Error) -> Self {
        Self::Settings(value)
    }
}

impl From<ollama_rest::errors::Error> for Error {
    fn from(value: ollama_rest::errors::Error) -> Self {
        Self::Api(value)
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::Io(value.kind())
    }
}

impl From<sqlx::Error> for Error {
    fn from(value: sqlx::Error) -> Self {
        Self::DbQuery(value)
    }
}

impl From<tauri::Error> for Error {
    fn from(value: tauri::Error) -> Self {
        Self::Tauri(value)
    }
}

impl From<MigrateError> for Error {
    fn from(value: MigrateError) -> Self {
        Self::Migration(value)
    }
}

impl<T> From<tokio::sync::mpsc::error::SendError<T>> for Error {
    fn from(_: tokio::sync::mpsc::error::SendError<T>) -> Self {
        Self::ChanSend
    }
}

impl From<ParsingError> for Error {
    fn from(_: ParsingError) -> Self {
        Self::InvalidRole
    }
}
