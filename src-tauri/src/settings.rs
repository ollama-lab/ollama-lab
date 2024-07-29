use std::{fs::File, io::{Read, Write}, path::PathBuf, sync::{LazyLock, OnceLock}};

use error::Error;
use serde::{Deserialize, Serialize};
use themes::Theme;

use crate::paths::local_config_dir;

pub mod error;
pub mod themes;

static SETTINGS_PATH: LazyLock<Option<PathBuf>> = LazyLock::new(|| {
    local_config_dir().map(|mut dir| {
        dir.push("settings.toml");
        dir
    })
});

static CUR_SETTINGS: OnceLock<Settings> = OnceLock::new();

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    addr: Option<String>,
    theme: Theme,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            addr: None,
            theme: Theme::System,
        }
    }
}

impl Settings {
    pub fn load() -> Result<Self, Error> {
        SETTINGS_PATH
            .as_ref()
            .ok_or(Error::NoValidConfigPath)
            .and_then(|settings_file| {
                File::open(settings_file)
                    .map_err(|err| Error::Io(err.kind()))
                    .and_then(|mut file| {
                        let mut content = String::new();
                        file.read_to_string(&mut content)
                            .map_err(|err| Error::Io(err.kind()))?;

                        toml::from_str::<Self>(content.as_str())
                            .map_err(|_| Error::TomlParsing)
                    })
                    .or_else(|err| match err {
                        Error::Io(std::io::ErrorKind::NotFound) => Ok(Self::default()),
                        _ => Err(err),
                    })
            })
    }

    pub fn save(&self) -> Result<(), Error> {
        SETTINGS_PATH
            .as_ref()
            .ok_or(Error::NoValidConfigPath)
            .and_then(|settings_file| {
                File::create(settings_file)
                    .map_err(|err| Error::Io(err.kind()))
                    .and_then(|mut file| {
                        let config_toml = toml::to_string::<Self>(self)
                            .map_err(|_| Error::TomlParsing)?;

                        file.write_all(config_toml.as_bytes())
                            .map_err(|err| Error::Io(err.kind()))
                    })
            })?;

        Ok(())
    }

    pub fn get_static() -> Result<&'static Self, Error> {
        Ok(if let Some(settings) = CUR_SETTINGS.get() {
            settings
        } else {
            let loaded_settings = Settings::load()?;

            CUR_SETTINGS.set(loaded_settings)
                .map_err(|_| Error::Sync)?;

            CUR_SETTINGS.get().unwrap()
        })
    }

    pub fn into_static(self) -> Result<(), Error> {
        CUR_SETTINGS.set(self)
            .map_err(|_| Error::Sync)?;

        Ok(())
    }

    pub fn addr(&self) -> Option<&str> {
        self.addr.as_ref().map(|s| s.as_str())
    }

    pub fn set_addr(&mut self, addr: Option<&str>) {
        self.addr = addr.map(|str_ref| str_ref.to_string());
    }

    pub fn theme(&self) -> &Theme {
        &self.theme
    }

    pub fn set_theme(&mut self, theme: Theme) {
        self.theme = theme;
    }
}
