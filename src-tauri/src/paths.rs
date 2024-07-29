use std::path::PathBuf;

use dirs::{config_local_dir, data_local_dir};

pub(crate) const APP_NAME: &str = "ollama-lab";

pub(crate) fn local_config_dir() -> Option<PathBuf> {
    config_local_dir().map(|mut dir| {
        dir.push(APP_NAME);
        dir
    })
}

pub(crate) fn local_data_dir() -> Option<PathBuf> {
    data_local_dir().map(|mut dir| {
        dir.push(APP_NAME);
        dir
    })
}
