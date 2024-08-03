use ollama_lab_db_desktop::{load_connection, model::session::Session, sqlx::SqliteExecutor};
use serde::Deserialize;

use crate::{api::get_ollama, db::DB_URL, error::Error};

#[derive(Deserialize)]
pub struct NewUserPrompt {
    session: Option<i32>,
    content: String,
}

struct NewPrompt<'a> {
    session: Option<i32>,
    role: &'a str,
    content: &'a str,
}

fn generate_prompt(exec: impl SqliteExecutor<'_>, cur_session: &Session) -> Result<(), Error> {
    todo!()
}

#[tauri::command]
pub async fn send_prompt(prompt: NewUserPrompt) -> Result<(), Error> {
    let mut conn = load_connection(DB_URL.get().ok_or_else(|| Error::NoDataPath)?)
        .await?;

    todo!();

    generate_prompt(&mut conn, &cur_session)?;

    Ok(())
}
