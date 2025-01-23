use app_state::AppState;
use commands::{
    init::initialize,
    models::{
        copy_model, delete_model, get_default_model, get_model, list_local_models,
        list_running_models, pull_model, set_default_model,
    },
    sessions::{
        list_sessions, rename_session, set_session_model, delete_session,
    },
};
use ollama_rest::Ollama;
use tauri::Manager;
use tokio::sync::Mutex;

pub mod app_state;
pub mod commands;
pub mod errors;
pub mod events;
pub mod models;
pub mod paths;
pub mod settings;
pub mod strings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            copy_model,
            delete_model,
            get_default_model,
            get_model,
            initialize,
            list_local_models,
            list_running_models,
            pull_model,
            set_default_model,
            list_sessions,
            rename_session,
            set_session_model,
            delete_session,
        ])
        .setup(|app| {
            app.manage(AppState {
                conn: Mutex::new(None),
                ollama: Ollama::default(),
                // Default profile
                profile: 0,
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
