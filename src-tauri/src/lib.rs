use std::path::PathBuf;

use app_state::AppState;
use errors::Error;
use ollama_rest::Ollama;
use paths::local_config_dir;
use settings::Settings;
use tauri::Manager;
use tokio::sync::Mutex;

pub mod app_state;
pub mod commands;
pub mod errors;
pub mod events;
pub mod models;
pub mod paths;
pub mod responses;
pub mod settings;
pub mod strings;
pub mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::models::copy_model,
            commands::models::delete_model,
            commands::models::get_default_model,
            commands::models::get_model,
            commands::init::initialize,
            commands::models::list_local_models,
            commands::models::list_running_models,
            commands::models::pull_model,
            commands::models::set_default_model,
            commands::sessions::list_sessions,
            commands::sessions::get_session,
            commands::sessions::rename_session,
            commands::sessions::set_session_model,
            commands::sessions::delete_session,
            commands::sessions::create_session,
            commands::chats::submit_user_prompt,
            commands::chats::regenerate_response,
            commands::chats::chat_history::get_current_branch,
            commands::chats::chat_history::switch_branch,
        ])
        .setup(|app| {
            let config_path = local_config_dir().map(|mut dir| {
                dir.push("default.settings.toml");
                dir
            })
            .ok_or(Error::Settings(settings::error::Error::NoValidConfigPath))?;

            let settings = Settings::load(&config_path)?;

            app.manage(AppState {
                conn_pool: Mutex::new(None),
                ollama: Ollama::default(),
                // Default profile
                profile: 0,
                config_path,
                settings: Mutex::new(settings),
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
