use std::fmt::Debug;

use serde::Serialize;

use crate::settings;

pub enum Error {
    Api(ollama_rest::errors::Error),
    Settings(settings::error::Error),
}

impl Debug for Error {
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
        })
    }
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(format!("{self:?}").as_str())
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
