// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod streaming;

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("ollama", |app, req| {
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
