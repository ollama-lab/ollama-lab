use std::fmt::Debug;

pub enum Error {
    AccessDenied,
    Io(std::io::ErrorKind),
    NoValidConfigPath,
    Sync,
    TomlParsing,
}

impl Debug for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cache: Option<String>;

        write!(f, "Settings: {}", match self {
            Error::AccessDenied => "Access denied",
            Error::Io(err_kind) => {
                cache = Some(format!("File I/O ({err_kind})"));
                cache.as_ref().unwrap().as_str()
            },
            Error::NoValidConfigPath => "No config path",
            Error::Sync => "Syncing Error",
            Error::TomlParsing => "Config file parsing failed",
        })
    }
}
