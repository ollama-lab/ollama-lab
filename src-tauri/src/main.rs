// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use command::{chat::{list_chat_bubbles, regenerate, send_prompt}, session::{list_sessions, remove_session}};
use db::auto_load_db_url;

mod api;
mod command;
mod db;
mod error;
mod paths;
mod settings;

fn main() {
    auto_load_db_url().unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_chat_bubbles,
            list_sessions,
            regenerate,
            remove_session,
            send_prompt,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
