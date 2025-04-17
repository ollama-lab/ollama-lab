use tauri::State;

use crate::{app_state::AppState, errors::Error, settings::Settings, utils::config::SaveTomlConfigFile};

#[tauri::command]
pub async fn get_settings(state: State<'_, AppState>) -> Result<Settings, Error> {
    Ok(state.settings.lock().await.clone())
}

#[tauri::command]
pub fn default_settings() -> Settings {
    Settings::default()
}

#[tauri::command]
pub async fn set_settings(
    state: State<'_, AppState>,
    new_settings: Settings,
) -> Result<Settings, Error> {
    new_settings.save(&state.config_path)?;
    *state.settings.lock().await = new_settings.clone();

    Ok(new_settings)
}
