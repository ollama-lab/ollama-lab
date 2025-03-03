use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error, utils::system_prompt::{get_system_prompt, set_system_prompt},
};

#[tauri::command]
pub async fn get_model_system_prompt(
    state: State<'_, AppState>,
    model: String,
) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    get_system_prompt(profile_id, model.as_str(), &mut *conn)
        .await
}

#[tauri::command]
pub async fn set_model_system_prompt(
    state: State<'_, AppState>,
    model: String,
    prompt: Option<String>,
) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    set_system_prompt(profile_id, model.as_str(), &mut *conn, prompt.as_ref().map(|s| s.as_str()))
        .await
}
