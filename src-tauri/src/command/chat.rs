use ollama_lab_db_desktop::{diesel::{self, prelude::*}, load_connection, model::session::Session, schema::{bubbles, sessions}};
use serde::Deserialize;

use crate::{api::get_ollama, db::{current_user, DB_URL}, error::Error};

#[derive(Debug, Deserialize)]
pub struct Prompt {
    session: i32,
    content: String,
}

impl Prompt {
    pub fn session(&self) -> i32 {
        self.session
    }

    pub fn content(&self) -> &str {
        self.content.as_str()
    }
}

#[derive(Insertable)]
#[diesel(table_name = bubbles)]
struct NewPrompt<'a> {
    session: Option<i32>,
    role: &'a str,
    content: &'a str,
}

#[tauri::command]
pub async fn send_prompt(prompt: Prompt) -> Result<(), Error> {
    let ollama = get_ollama()?;

    let mut conn = load_connection(DB_URL.get().ok_or_else(|| Error::NoDataPath)?).map_err(|_| Error::DbFailure)?;

    let user = current_user(&mut conn)?;

    conn.immediate_transaction(|conn| {
        {
            use ollama_lab_db_desktop::schema::sessions::dsl::*;

            // FIXME
            let matched_count = Session::belonging_to(user)
                .filter(id.eq(prompt.session()))
                .count()
                .get_result(conn);

            if matched_count < 1 {
            }
        }

        Ok(())
    }).map_err(|_| Error::DbFailure)?;

    todo!("Construct chat history");

    todo!("Call ollama");

    Ok(())
}
