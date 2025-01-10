use ollama_rest::{models::model::{ModelListResponse, RunningModelResponse}, Ollama};

use crate::errors::CommandError;

#[tauri::command]
pub async fn list_local_models() -> Result<ModelListResponse, CommandError> {
    Ok(Ollama::default().local_models().await?)
}

#[tauri::command]
pub async fn list_running_models() -> Result<RunningModelResponse, CommandError> {
    Ok(Ollama::default().running_models().await?)
}
