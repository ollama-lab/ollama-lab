use std::path::PathBuf;

use ollama_rest::Ollama;
use sqlx::SqlitePool;
use tokio::sync::Mutex;

use crate::settings::Settings;

pub struct AppState {
    pub conn_pool: Mutex<Option<SqlitePool>>,
    pub ollama: Ollama,
    pub profile: i64,
    pub config_path: PathBuf,
    pub settings: Mutex<Settings>,
}
