#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main]
async fn main() -> Result<(), String> {
    ollama_lab_lib::run().await
        .map_err(|err| format!("{err:?}"))
}
