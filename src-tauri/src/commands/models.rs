use ollama_rest::models::model::{ModelListResponse, RunningModelResponse, ModelShowRequest, ModelShowResponse};

use crate::{api::get_ollama, errors::Error};

#[tauri::command]
pub async fn list_local_models() -> Result<ModelListResponse, Error> {
    let ollama = get_ollama()?;
    Ok(ollama.local_models().await?)
}

#[tauri::command]
pub async fn list_running_models() -> Result<RunningModelResponse, Error> {
    let ollama = get_ollama()?;
    Ok(ollama.running_models().await?)
}

#[tauri::command]
pub async fn get_model(name: String) -> Result<ModelShowResponse, Error> {
    let ollama = get_ollama()?;
    Ok(ollama.model(&ModelShowRequest{
        name,
        verbose: None,
    }).await?)
}
