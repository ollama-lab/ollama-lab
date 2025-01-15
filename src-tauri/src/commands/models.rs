use std::sync::Arc;

use ollama_rest::models::model::{ModelListResponse, RunningModelResponse, ModelShowRequest, ModelShowResponse};
use tauri::State;

use crate::{app_state::AppState, errors::Error};

#[tauri::command]
pub async fn list_local_models(state: State<'_, Arc<AppState>>) -> Result<ModelListResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama.local_models().await?)
}

#[tauri::command]
pub async fn list_running_models(state: State<'_, Arc<AppState>>) -> Result<RunningModelResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama.running_models().await?)
}

#[tauri::command]
pub async fn get_model(state: State<'_, Arc<AppState>>, name: String) -> Result<ModelShowResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama.model(&ModelShowRequest{
        name,
        verbose: None,
    }).await?)
}
