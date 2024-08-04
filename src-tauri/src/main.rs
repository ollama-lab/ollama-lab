// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use cli::Cli;
use command::chat::{regenerate, send_prompt};
use db::auto_load_db_url;

mod api;
mod cli;
mod command;
mod db;
mod error;
mod paths;
mod settings;

fn main() {
    let _args = Cli::parse();

    auto_load_db_url().unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            regenerate,
            send_prompt,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
