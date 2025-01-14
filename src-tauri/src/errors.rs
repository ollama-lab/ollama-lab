use std::fmt::Display;

use serde::{ser::SerializeStruct, Serialize};

use crate::settings;

#[derive(Debug)]
pub enum Error {
    AccessDenied,
    Api(ollama_rest::errors::Error),
    DbQuery(sqlx::Error),
    Io(std::io::ErrorKind),
    NoDataPath,
    Settings(settings::error::Error),
    StaticSync,
    Tauri(tauri::Error),
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cache: Option<String>;

        write!(f, "{}", match self {
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
        })
    }
}

impl std::error::Error for Error {}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("CommandError", 1)?;
        state.serialize_field("message", self.to_string().as_str())?;
        state.end()
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
