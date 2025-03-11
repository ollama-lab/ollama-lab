use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    utils::system_prompt::{
        get_system_prompt,
        set_system_prompt,
        get_session_system_prompt as get_session_system_prompt_,
        set_session_system_prompt as set_session_system_prompt_,
    },
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

#[tauri::command]
pub async fn get_session_system_prompt(
    state: State<'_, AppState>,
    session_id: i64,
) -> Result<Option<String>, Error> {
    let pool = &state.conn_pool;

    Ok(get_session_system_prompt_(session_id, pool).await?)
}

#[tauri::command]
pub async fn set_session_system_prompt(
    state: State<'_, AppState>,
    session_id: i64,
    value: Option<String>,
) -> Result<Option<String>, Error> {
    let pool = &state.conn_pool;

    Ok(set_session_system_prompt_(session_id, value.as_ref().map(|r| r.as_str()), pool).await?)
}
