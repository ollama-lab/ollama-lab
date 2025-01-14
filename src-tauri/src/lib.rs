use commands::models::{get_model, list_local_models, list_running_models};

pub mod api;
pub mod commands;
pub mod errors;
pub mod paths;
pub mod settings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_model,
            list_local_models,
            list_running_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
