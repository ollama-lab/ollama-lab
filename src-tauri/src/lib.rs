use std::sync::Arc;

use app_state::AppState;
use commands::models::{get_model, list_local_models, list_running_models};
use ollama_rest::Ollama;
use paths::db_dir;
use sqlx::SqlitePool;
use tauri::Manager;
use tokio::sync::Mutex;

pub mod app_state;
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
        .setup(|app| {
            let (tx, rx) = std::sync::mpsc::channel();

            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.spawn(async move {
                // TODO: Handle errors
                tx.send(SqlitePool::connect(db_dir().unwrap().to_str().unwrap()).await.unwrap()).unwrap();
            });

            let conn = rx.recv()?;

            app.manage(Arc::new(AppState{
                conn: Mutex::new(conn),
                ollama: Ollama::default(),
            }));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
