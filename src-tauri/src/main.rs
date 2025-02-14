// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;

mod cli;

fn main() {
    let _ = cli::Args::parse();

    ollama_lab_lib::run()
}
