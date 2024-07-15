// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // TODO
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
