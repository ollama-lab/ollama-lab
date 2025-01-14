use ollama_rest::models::model::{ModelListResponse, RunningModelResponse, ModelShowRequest, ModelShowResponse};
use tauri::State;
use tokio::sync::Mutex;

use crate::{app_state::AppState, errors::Error};

#[tauri::command]
pub async fn list_local_models(state: State<'_, Mutex<AppState>>) -> Result<ModelListResponse, Error> {
    let ollama = &state.lock().await.ollama;
    Ok(ollama.local_models().await?)
}

#[tauri::command]
pub async fn list_running_models(state: State<'_, Mutex<AppState>>) -> Result<RunningModelResponse, Error> {
    let ollama = &state.lock().await.ollama;
    Ok(ollama.running_models().await?)
}

#[tauri::command]
pub async fn get_model(state: State<'_, Mutex<AppState>>, name: String) -> Result<ModelShowResponse, Error> {
    let ollama = &state.lock().await.ollama;
    Ok(ollama.model(&ModelShowRequest{
        name,
        verbose: None,
    }).await?)
}
