use ollama_rest::{models::model::Model, prelude::{ModelShowRequest, ModelShowResponse, RunningModel}};

use crate::{api::get_ollama, error::Error};

#[tauri::command]
pub async fn list_models() -> Result<Vec<Model>, Error> {
    let ollama = get_ollama()?;

    Ok(ollama.local_models().await?.models)
}

#[tauri::command]
pub async fn list_running_models() -> Result<Vec<RunningModel>, Error> {
    let ollama = get_ollama()?;

    Ok(ollama.running_models().await?.models)
}

#[tauri::command]
pub async fn model_info(name: String) -> Result<ModelShowResponse, Error> {
    let ollama = get_ollama()?;

    Ok(
        ollama.model(&ModelShowRequest {
            name, verbose: None,
        }).await?
    )
}
