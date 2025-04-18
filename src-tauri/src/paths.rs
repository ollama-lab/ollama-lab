use std::path::PathBuf;

use dirs::{config_local_dir, data_local_dir};

pub(crate) const APP_NAME: &str = "ollama-lab";
#[cfg(not(debug_assertions))]
pub(crate) const DB_NAME: &str = "data.sqlite";
#[cfg(debug_assertions)]
pub(crate) const DB_NAME: &str = "data-dev.sqlite";

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

pub(crate) fn db_path() -> Option<PathBuf> {
    local_data_dir().map(|mut dir| {
        dir.push(DB_NAME);
        dir
    })
}

pub(crate) fn settings_path(profile: &str) -> Option<PathBuf> {
    local_config_dir()
        .map(|mut dir| {
            dir.push(format!("{}.settings.toml", profile));
            dir
        })
}

pub(crate) fn mcp_config_path(profile: &str) -> Option<PathBuf> {
    local_config_dir()
        .map(|mut dir| {
            dir.push(format!("{}.mcp.toml", profile));
            dir
        })
}
