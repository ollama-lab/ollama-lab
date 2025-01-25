use ollama_rest::chrono::Utc;
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{
    app_state::AppState,
    errors::Error,
    events::StreamingResponseEvent,
    models::{chat::{ChatGenerationReturn, IncomingUserPrompt}, session::Session},
    responses::llm_streams::stream_response,
};

#[tauri::command]
pub async fn submit_user_prompt(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: i64,
    parent_id: Option<i64>,
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

    let mut tx = conn.begin().await?;

    sqlx::query("\
        UPDATE chats
        SET priority = 0
        WHERE session_id = $1, parent_id = $2;
    ")
        .bind(session_id).bind(parent_id)
        .execute(&mut *tx)
        .await?;

    let prompt_ret = sqlx::query_as::<_, (i64, i64,)>("\
        INSERT INTO chats (session_id, role, content, parent_id)
        VALUES ($1, 'user', $2, $3)
        RETURNING id, date_created;
    ")
        .bind(session.id).bind(prompt.text).bind(parent_id)
        .fetch_one(&mut *tx)
        .await?;

    on_stream.send(StreamingResponseEvent::UserPrompt {
        id: prompt_ret.0,
        timestamp: prompt_ret.1,
    })?;

    let response_ret = sqlx::query_as::<_, (i64,)>("\
        INSERT INTO chats (session_id, role, content, completed, model)
        VALUES ($1, 'assistant', $2, FALSE, $3)
        RETURNING id;
    ")
        .bind(session.id).bind("").bind(session.current_model.as_str())
        .fetch_one(&mut *tx)
        .await?;

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
}
