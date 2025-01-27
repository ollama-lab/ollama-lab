use std::str::FromStr;

use ollama_rest::{chrono::Utc, prelude::Role};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{
    app_state::AppState,
    errors::Error,
    events::StreamingResponseEvent,
    models::{chat::{ChatGenerationReturn, IncomingUserPrompt}, session::Session},
    responses::{llm_streams::stream_response, tree::{models::NewChildNode, ChatTree}},
    utils::connections::CloneMutexContentAsync,
};

pub mod chat_history;

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
    let pool = state.conn_pool.clone_inside().await?;

    let session = sqlx::query_as::<_, Session>(r#"
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE id = $1 AND profile_id = $2;
    "#)
        .bind(session_id).bind(profile_id)
        .fetch_optional(&pool)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);

    let mut tx = pool.begin().await?;

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
        model: Some(session.current_model.as_str()),
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
    chat_id: i64,
    on_stream: Channel<StreamingResponseEvent>,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let pool = state.conn_pool.clone_inside().await?;

    let session = sqlx::query_as::<_, Session>(r#"
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE id = $1 AND profile_id = $2;
    "#)
        .bind(session_id).bind(profile_id)
        .fetch_optional(&pool)
        .await?
        .ok_or(Error::NotExists)?;

    let chat = sqlx::query_as::<_, (String,)>(r#"
        SELECT role
        FROM chats
        WHERE id = $1 AND session_id = $2;
    "#)
        .bind(chat_id).bind(session.id)
        .fetch_optional(&pool)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);
    let mut tx = pool.begin().await?;

    let response_ret = match Role::from_str(chat.0.as_str())? {
        Role::User => {
            let first_sibling_chat = sqlx::query_as::<_, (String,)>(r#"
                SELECT model
                FROM chats
                WHERE parent_id = $1 AND session_id = $2
                LIMIT 1;
            "#)
                .bind(chat_id).bind(session.id)
                .fetch_optional(&mut *tx)
                .await?
                .ok_or(Error::NotExists)?;

            tree.new_child(&mut tx, Some(chat_id), NewChildNode{
                role: Role::Assistant,
                model: Some(first_sibling_chat.0.as_str()),
                content: String::new(),
                completed: false,
            }).await.map(|ret| (ret.0,))
        }
        Role::Assistant => {
            tree.new_sibling(&mut tx, chat_id, None, Some(false))
                .await
                .map(|ret| (ret,))
        }
        _ => Err(Error::InvalidRole),
    }?;

    tx.commit().await?;

    let (cancel_tx, cancel_rx) = oneshot::channel();

    let event_id = app.once(format!("cancel-gen/{}", response_ret.0), move |_| {
        cancel_tx.send(()).unwrap();
    });

    let (tx, mut rx) = mpsc::channel(32);

    let ollama2 = ollama.clone();
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

    Ok(ChatGenerationReturn{
        id: 0,
        date_created: Utc::now(),
    })
}
