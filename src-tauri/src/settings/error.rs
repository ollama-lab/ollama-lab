use std::fmt::Debug;

pub enum Error {
    Io(std::io::ErrorKind),
    NoValidConfigPath,
    Sync,
    TomlEncoding(toml::ser::Error),
    TomlParsing(toml::de::Error),
}

impl Debug for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cache: Option<String>;

        write!(f, "Settings: {}", match self {
            Error::Io(err_kind) => {
                cache = Some(format!("File I/O ({err_kind:?})"));
                cache.as_ref().unwrap().as_str()
            }
            Error::NoValidConfigPath => "No config path",
            Error::Sync => "Syncing Error",
            Error::TomlParsing(err) => {
                cache = Some(format!("Config file parsing failed: {:?}", err));
                cache.as_ref().unwrap().as_str()
            }
            Error::TomlEncoding(err) => {
                cache = Some(format!("Config file encoding failed: {:?}", err));
                cache.as_ref().unwrap().as_str()
            }
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::Io(value.kind())
    }
}

impl From<toml::de::Error> for Error {
    fn from(value: toml::de::Error) -> Self {
        Self::TomlParsing(value)
    }
}

impl From<toml::ser::Error> for Error {
    fn from(value: toml::ser::Error) -> Self {
        Self::TomlEncoding(value)
    }
}
