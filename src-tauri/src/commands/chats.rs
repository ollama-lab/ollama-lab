use ollama_rest::{chrono::Utc, prelude::Role};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{
    app_state::AppState,
    errors::Error,
    events::StreamingResponseEvent,
    models::{chat::{ChatGenerationReturn, IncomingUserPrompt}, session::Session},
    responses::{llm_streams::stream_response, tree::{models::NewChildNode, ChatTree}},
};

#[tauri::command]
pub async fn submit_user_prompt(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: i64,
    parent_id: Option<i64>,
    model: String,
    prompt: IncomingUserPrompt,
    on_stream: Channel<StreamingResponseEvent>,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let session = sqlx::query_as::<_, Session>("\
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE id = $1 AND profile_id = $2;
    ")
        .bind(session_id).bind(profile_id)
        .fetch_optional(conn)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);

    let mut tx = conn.begin().await?;

    let user_chat_ret = tree.new_child(&mut tx, parent_id, NewChildNode{
        model: None,
        role: Role::User,
        content: prompt.text,
        completed: true,
    }).await?;

    on_stream.send(StreamingResponseEvent::UserPrompt {
        id: user_chat_ret.0,
        timestamp: user_chat_ret.1,
    })?;

    let response_ret = tree.new_child(&mut tx, Some(user_chat_ret.0), NewChildNode {
        content: String::new(),
        role: Role::Assistant,
        model: Some(model),
        completed: false,
    }).await?;

    on_stream.send(StreamingResponseEvent::ResponseInfo { id: response_ret.0 })?;

    tx.commit().await?;

    // Text streaming channel
    let (tx, mut rx) = mpsc::channel(32);

    let (cancel_tx, cancel_rx) = oneshot::channel();

    let event_id = app.once(format!("cancel-gen/{}", response_ret.0), move |_| {
        cancel_tx.send(()).unwrap();
    });

    let ollama2 = ollama.clone();
    let pool = conn.clone();
    tokio::spawn(async move {
        stream_response(ollama2, &pool, tx.clone(), response_ret.0, Some(cancel_rx), session.id, session.current_model.as_str())
            .await.unwrap();
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

    app.unlisten(event_id);

    Ok(ChatGenerationReturn {
        id: response_ret.0,
        date_created: Utc::now(),
    })
}

#[tauri::command]
pub async fn regenerate_response(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: i64,
    parent_id: Option<i64>,
    prompt: IncomingUserPrompt,
    on_stream: Channel<StreamingResponseEvent>,
) -> Result<ChatGenerationReturn, Error> {
    Ok(ChatGenerationReturn{
        id: 0,
        date_created: Utc::now(),
    })
}
