use command::{chat::{list_chat_bubbles, regenerate, send_prompt}, model::list_models, session::{list_sessions, remove_session}};
use db::{auto_load_db_url, update_database};

mod api;
mod command;
mod db;
mod error;
mod paths;
mod settings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_chat_bubbles,
            list_models,
            list_sessions,
            regenerate,
            remove_session,
            send_prompt,
        ])
        .setup(|_| {
            auto_load_db_url().unwrap();
            let _ = update_database();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
