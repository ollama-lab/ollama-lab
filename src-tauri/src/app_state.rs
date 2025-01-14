use ollama_rest::Ollama;
use sqlx::SqlitePool;

pub struct AppState {
    pub conn: SqlitePool,
    pub ollama: Ollama,
}
