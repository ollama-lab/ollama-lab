// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::mpsc::channel;

use networking::AddrState;
use tauri::Manager;

use axum::Router;
use ollama_lab_api::ServerRoutes;
use tokio::net::TcpListener;

use networking::get_addr;

mod networking;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_addr])
        .setup(|tauri_app| {
            let (tx, rx) = channel();

            tauri::async_runtime::spawn(async move {
                let app = Router::new()
                    .load_chat_apis();

                let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();

                tx.send(listener.local_addr().unwrap().to_string()).unwrap();

                axum::serve(listener, app).await.unwrap();
            });

            tauri_app.manage(AddrState(rx.recv().unwrap()));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
