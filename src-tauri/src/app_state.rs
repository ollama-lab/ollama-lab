use ollama_rest::Ollama;
use sqlx::SqlitePool;
use tokio::sync::Mutex;

pub struct AppState {
    pub conn: Mutex<SqlitePool>,
    pub ollama: Ollama,
}
