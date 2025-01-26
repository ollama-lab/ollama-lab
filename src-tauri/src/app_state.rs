use ollama_rest::Ollama;
use sqlx::SqlitePool;
use tokio::sync::Mutex;

pub struct AppState {
    pub conn_pool: Mutex<Option<SqlitePool>>,
    pub ollama: Ollama,
    pub profile: i64,
}
