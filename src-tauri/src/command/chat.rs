use serde::Deserialize;

use crate::{api::get_ollama, error::Error};

#[derive(Debug, Deserialize)]
pub struct Prompt {
    session: u32,
    content: String,
}

impl Prompt {
    pub fn session(&self) -> u32 {
        self.session
    }

    pub fn content(&self) -> &str {
        self.content.as_str()
    }
}

#[tauri::command]
pub async fn send_prompt(prompt: Prompt) -> Result<(), Error> {
    let ollama = get_ollama()?;

    todo!("Save to DB");

    todo!("Construct chat history");

    todo!("Call ollama");

    Ok(())
}
