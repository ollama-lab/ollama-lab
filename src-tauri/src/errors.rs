use std::fmt::Display;

use image::ImageError;
use ollama_rest::models::errors::ParsingError;
use rmcp::{transport::sse::SseTransportError, ServiceError};
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
    Image(ImageError),
    Message(String),
    ChatHalted,
    RmcpService(ServiceError),
    RmcpSseTransport(SseTransportError),
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cache: Option<String>;
        write!(
            f,
            "{}",
            match self {
                Self::Api(err) => {
                    match err {
                        ollama_rest::errors::Error::ClientCreation(reqwest_err) => {
                            let url = reqwest_err.url();
                            cache = Some(
                                format!(
                                    "Failed to connect to the Ollama server at {}. Is the Ollama server running?",
                                    url.map(|url| url.as_str()).unwrap_or("unknown address"),
                                )
                            );
                        }
                        _ => {
                            cache = Some(format!("{:?}", err));
                        }
                    }

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
                Self::Image(err) => {
                    cache = Some(format!("{:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::Message(msg) => msg,
                Self::ChatHalted => "Chat stopped by user",
                Self::RmcpService(err) => {
                    cache = Some(format!("RMCP error: {:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
                Self::RmcpSseTransport(err) => {
                    cache = Some(format!("RMCP SSE transport error: {:?}", err));
                    cache.as_ref().unwrap().as_str()
                }
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

impl From<ImageError> for Error {
    fn from(value: ImageError) -> Self {
        Self::Image(value)
    }
}

impl From<String> for Error {
    fn from(value: String) -> Self {
        Self::Message(value)
    }
}
                

impl From<&str> for Error {
    fn from(value: &str) -> Self {
        Self::Message(value.to_string())
    }
}

impl From<ServiceError> for Error {
    fn from(value: ServiceError) -> Self {
        Self::RmcpService(value)
    }
}

impl From<SseTransportError> for Error {
    fn from(value: SseTransportError) -> Self {
        Self::RmcpSseTransport(value)
    }
}
