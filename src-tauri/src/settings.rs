use std::{fs::File, io::{Read, Write}, path::Path};

use appearance::AppearanceSettings;
use error::Error;
use ollama::OllamaSettings;
use serde::{Deserialize, Serialize};

pub mod appearance;
pub mod error;
pub mod ollama;

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Settings {
    pub appearance: AppearanceSettings,
    pub ollama: OllamaSettings,
}

impl Settings {
    pub fn load(path: impl AsRef<Path>) -> Result<Self, Error> {
        File::open(path)
            .map_err(|err| Error::Io(err.kind()))
            .and_then(|mut file| {
                let mut content = String::new();
                file.read_to_string(&mut content)?;

                Ok(toml::from_str::<Self>(content.as_str())?)
            })
            .or_else(|err| match err {
                Error::Io(std::io::ErrorKind::NotFound) => Ok(Self::default()),
                _ => Err(err),
            })
    }

    pub fn save(&self, path: impl AsRef<Path>) -> Result<(), Error> {
        File::create(path)
            .map_err(|err| Error::Io(err.kind()))
            .and_then(|mut file| {
                let config_toml = toml::to_string::<Self>(self)?;

                Ok(file.write_all(config_toml.as_bytes())?)
            })
    }
}
