use ollama_rs::{models::LocalModel, Ollama};

use crate::errors::CommandError;

#[tauri::command]
pub async fn list_local_models() -> Result<Vec<LocalModel>, CommandError> {
    Ollama::default().list_local_models()
        .await
        .map_err(|err| err.into())
}
