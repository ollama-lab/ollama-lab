use tauri::State;

use crate::{app_state::AppState, errors::Error, models::chat::IncomingUserPrompt};

#[tauri::command]
pub async fn submit_user_prompt(
    state: State<'_, AppState>,
    session_id: Option<i64>,
    prompt: IncomingUserPrompt,
) -> Result<(), Error> {
}
