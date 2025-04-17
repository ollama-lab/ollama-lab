use std::{fs::{create_dir_all, File}, io::{Read, Write}, path::Path};

use serde::{de::DeserializeOwned, Serialize};

use crate::errors::Error;

pub trait SaveTomlConfigFile {
    fn save(&self, path: impl AsRef<Path>) -> Result<(), Error>;
}

pub trait LoadTomlConfigFile : Sized {
    fn load(path: impl AsRef<Path>) -> Result<Self, Error>;
}

impl<T> SaveTomlConfigFile for T
where
    T: Serialize,
{
    fn save(&self, path: impl AsRef<Path>) -> Result<(), Error> {
        if let Some(parent) = path.as_ref().parent() {
            create_dir_all(&parent)?;
        }

        File::create(path)
            .map_err(|err| Error::Io(err.kind()))
            .and_then(|mut file| {
                let config_toml = toml::to_string::<Self>(self).unwrap();
                Ok(file.write_all(config_toml.as_bytes())?)
            })
    }
}

impl<T> LoadTomlConfigFile for T
where
    T: Default + DeserializeOwned,
{
    fn load(path: impl AsRef<Path>) -> Result<Self, Error> {
        File::open(path)
            .map_err(|err| Error::Io(err.kind()))
            .and_then(|mut file| {
                let mut content = String::new();
                file.read_to_string(&mut content)?;

                Ok(toml::from_str::<Self>(content.as_str()).unwrap())
            })
            .or_else(|err| match err {
                Error::Io(std::io::ErrorKind::NotFound) => Ok(Self::default()),
                _ => Err(err),
            })
    }
}
