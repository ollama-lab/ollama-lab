use futures::StreamExt;
use ollama_lab_db_desktop::{load_connection, model::{bubble::{Bubble, NewBubble}, session::NewSession, Role}, sqlx::{Connection, SqliteConnection}};
use ollama_rest::prelude::{ChatRequest, Message};
use serde::{Deserialize, Serialize};
use tauri::Emitter;

use crate::{api::get_ollama, db::DB_URL, error::Error};

#[derive(Deserialize)]
pub struct NewUserPrompt {
    session: Option<i32>,
    content: String,
    model: String,
}

#[derive(Clone, Serialize)]
struct StreamPayload {
    session: i32,
    role: String,
    content: String,
}

async fn generate_prompt(win: &tauri::Window, conn: &mut SqliteConnection, session_id: i32, model_id: &str) -> Result<Bubble, Error> {
    let ollama = get_ollama()?;

    let chat_history: Vec<Message> = Bubble::from_session(&mut *conn, session_id)
        .await?
        .into_iter()
        .map(|bubble| {
            Message {
                role: match bubble.role() {
                    Role::User => ollama_rest::models::chat::Role::User,
                    Role::System => ollama_rest::models::chat::Role::System,
                    Role::Assistant => ollama_rest::models::chat::Role::Assistant,
                },
                content: bubble.content().to_string(),
                images: None,
                tool_calls: None,
            }
        })
        .collect();

    let request = serde_json::from_value::<ChatRequest>(serde_json::json!({
        "model": model_id,
        "messages": chat_history,
    })).map_err(|err| Error::Api(ollama_rest::errors::Error::JsonDecoding(err)))?;

    let mut stream = ollama.chat_streamed(&request).await?;

    let mut response = String::new();

    while let Some(Ok(res)) = stream.next().await {
        if let Some(msg) = res.message {
            response.push_str(msg.content.as_str());

            win.emit("llm_stream_out", StreamPayload {
                session: session_id,
                role: msg.role.to_string(),
                content: msg.content,
            })?;
        }
    }

    let bubble = NewBubble::new(session_id, Role::Assistant, response.as_str())
        .save_into_returning(&mut *conn)
        .await?;

    Ok(bubble)
}

#[tauri::command]
pub async fn send_prompt(window: tauri::Window, prompt: NewUserPrompt) -> Result<(), Error> {
    let mut conn = load_connection(DB_URL.get().ok_or_else(|| Error::NoDataPath)?)
        .await?;

    let mut tx = conn.begin().await?;

    let session_id = if let Some(session_id) = prompt.session {
        session_id
    } else {
        NewSession::new_local(Some(prompt.content.as_str()))
            .save_into_returning(&mut *tx)
            .await?
            .id()
    };

    NewBubble::new(session_id, Role::User, prompt.content.as_str())
        .save_into(&mut *tx)
        .await?;

    tx.commit().await?;

    generate_prompt(&window, &mut conn, session_id, prompt.model.as_str()).await?;

    Ok(())
}
