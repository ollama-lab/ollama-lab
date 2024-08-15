use command::{
    chat::{list_chat_bubbles, regenerate, send_prompt},
    model::{list_models, list_running_models, model_info},
    session::{list_sessions, remove_session},
};
use db::{create_db_file, db_file, load_connection, update_database};
use error::Error;

mod api;
mod command;
mod db;
mod error;
mod paths;
mod settings;

async fn init() -> Result<(), Error> {
    if !db_file()?.try_exists()? {
        create_db_file().await?;
    }

    load_connection().await?;
    update_database().await?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() -> Result<(), Error> {
    init().await?;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_chat_bubbles,
            list_models,
            list_running_models,
            list_sessions,
            model_info,
            regenerate,
            remove_session,
            send_prompt,
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
