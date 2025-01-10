use commands::models::list_local_models;

pub mod commands;
pub mod errors;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_local_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
