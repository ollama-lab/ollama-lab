use tauri::State;

use crate::{app_state::AppState, errors::Error};

#[tauri::command]
pub fn list_sessions(state: State<'_, AppState>) -> Result<(), Error> {
}
