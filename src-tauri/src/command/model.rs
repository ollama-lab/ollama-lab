use ollama_rest::models::model::Model;

use crate::{api::get_ollama, error::Error};

#[tauri::command]
pub async fn list_models() -> Result<Vec<Model>, Error> {
    let ollama = get_ollama()?;

    Ok(ollama.local_models().await?.models)
}
