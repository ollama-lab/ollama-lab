use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    utils::{connections::ConvertMutexContentAsync, system_prompt::SystemPromptOperator},
};

#[tauri::command]
pub async fn get_model_system_prompt(
    state: State<'_, AppState>,
    model: String,
) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.convert_to().await?;

    SystemPromptOperator::new(profile_id, model.as_str())
        .get(&mut *conn)
        .await
}

#[tauri::command]
pub async fn set_model_system_prompt(
    state: State<'_, AppState>,
    model: String,
    prompt: Option<String>,
) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.convert_to().await?;

    SystemPromptOperator::new(profile_id, model.as_str())
        .set(&mut *conn, prompt.as_ref().map(|s| s.as_str()))
        .await
}
