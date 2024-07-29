use serde::Deserialize;

use crate::settings::Settings;

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
pub async fn send_prompt(prompt: &Prompt) -> Result<(), String> {
    todo!();
    Settings::get_static()
}
