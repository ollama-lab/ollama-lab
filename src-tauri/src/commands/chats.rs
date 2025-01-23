use ollama_rest::{chrono::Utc, models::chat::ChatRequest};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{app_state::AppState, errors::Error, events::StreamingResponseEvent, models::chat::{Chat, ChatGenerationReturn, IncomingUserPrompt}};

#[tauri::command]
pub async fn submit_user_prompt(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: i64,
    prompt: IncomingUserPrompt,
    on_stream: Channel<StreamingResponseEvent<'_>>,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let session_count = sqlx::query_as::<_, (i64,)>("\
        SELECT COUNT(*)
        FROM sessions
        WHERE id = $1 AND profile_id = $2;
    ")
        .bind(session_id).bind(profile_id)
        .fetch_one(conn)
        .await?;

    if session_count.0 < 1 {
        return Err(Error::NotExists);
    }

    let chat_history = sqlx::query_as::<_, Chat>("\
        SELECT id, session_id, role, content, completed, date_created, date_edited, model
        FROM chats
        WHERE session_id = $1 AND completed = TRUE 
        ORDER BY date_created, id;
    ")
        .bind(session_id)
        .fetch_all(conn)
        .await?;

    let (cancel_tx, cancel_rx) = oneshot::channel();

    app.once(format!("cancel-gen/{}", session_id), move |_| {
        cancel_tx.send(()).unwrap();
    });

    // Text streaming channel
    let (tx, mut rx) = mpsc::channel(32);

    let res = ollama.chat_streamed(ChatRequest{
        // TODO:
    });

    tokio::spawn(async move {
        let tx2 = tx.clone();
        let tx3 = tx.clone();

        tokio::select! {
            Err(err) = async move {

                Ok::<(), Error>(())
            } => {
                _ = tx.send(StreamingResponseEvent::Failure {
                    message: Some(err.to_string()),
                }).await;
            }

            _ = cancel_rx => {
                _ = tx3.send(StreamingResponseEvent::Canceled {
                    message: Some("Canceled by user.".to_string()),
                }).await;
            }
        }
    });

    while let Some(event) = rx.recv().await {
        match event {
            StreamingResponseEvent::Text { .. } => {}
            _ => {
                rx.close();
            }
        }

        on_stream.send(event)?;
    }

    Ok(ChatGenerationReturn {
        id: 1,
        date_created: Utc::now(),
    })
}
