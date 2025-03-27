use std::str::FromStr;

use ollama_rest::{chrono::Utc, models::chat::Role};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::broadcast;

use crate::{
    app_state::AppState,
    chat_gen::utils::{
        add_assistant_prompt, stream_via_channel, 
    },
    errors::Error,
    events::StreamingResponseEvent,
    models::{chat::{ChatGenerationReturn, IncomingUserPrompt}, session::mode::SessionMode},
    responses::tree::ChatTree,
    utils::{
        chats::{launch_h2h_chat, launch_normal_chat},
        sessions::get_session,
    },
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
    reuse_sibling_images: bool,
    mode: SessionMode,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let pool = &state.conn_pool;

    let (cancel_tx, cancel_rx) = broadcast::channel(1);

    let cancel_tx2 = cancel_tx.clone();
    let event_id: Option<u32> = Some(app.once("cancel-gen", move |_| {
        cancel_tx2.send(()).unwrap();
    }));

    let result = match mode {
        SessionMode::Normal => {
            launch_normal_chat(
                pool,
                ollama,
                profile_id,
                session_id,
                parent_id,
                prompt,
                on_stream,
                reuse_sibling_images,
                Some(cancel_rx),
            ).await
        }
        SessionMode::H2h => {
            launch_h2h_chat(
                pool,
                ollama,
                profile_id,
                session_id,
                parent_id,
                prompt,
                on_stream,
                reuse_sibling_images,
                Some(&cancel_tx),
            ).await
        }
    };

    if let Some(event_id) = event_id {
        app.unlisten(event_id);
    }
    result
}

#[tauri::command]
pub async fn regenerate_response(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: i64,
    chat_id: i64,
    model: Option<String>,
    on_stream: Channel<StreamingResponseEvent>,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let pool = state.conn_pool.clone();

    let session = get_session(&pool, profile_id, session_id) 
        .await?
        .ok_or(Error::NotExists)?;

    let chat = sqlx::query_as::<_, (String,)>(
        r#"
        SELECT role
        FROM chats
        WHERE id = $1 AND session_id = $2;
    "#,
    )
    .bind(chat_id)
    .bind(session.id)
    .fetch_optional(&pool)
    .await?
    .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);
    let mut tx = pool.begin().await?;

    let response_id = match Role::from_str(chat.0.as_str())? {
        Role::User => {
            let first_sibling_chat = sqlx::query_as::<_, (String, Option<i64>)>(
                r#"
                SELECT model, agent_id
                FROM chats
                WHERE parent_id = $1 AND session_id = $2
                LIMIT 1;
            "#,
            )
            .bind(chat_id)
            .bind(session.id)
            .fetch_optional(&mut *tx)
            .await?
            .ok_or(Error::NotExists)?;

            let ret = add_assistant_prompt(
                &mut tx,
                &tree,
                Some(chat_id),
                first_sibling_chat.1,
                first_sibling_chat.0.as_str(),
                &on_stream
            ).await?;

            Ok(ret.id)
        }
        Role::Assistant => {
            let node_id = tree
                .new_sibling(
                    &mut tx,
                    chat_id,
                    None,
                    Some(false),
                    model.as_ref().map(|s| s.as_str()),
                )
                .await?;

            on_stream.send(StreamingResponseEvent::ResponseInfo { id: node_id })?;

            Ok(node_id)
        },
        _ => Err(Error::InvalidRole),
    }?;

    tx.commit().await?;

    let (cancel_tx, cancel_rx) = broadcast::channel(1);

    let event_id = app.once("cancel-gen", move |_| {
        cancel_tx.send(()).unwrap();
    });

    stream_via_channel(
        ollama.clone(),
        pool,
        response_id,
        Some(cancel_rx),
        session.id,
        model.unwrap_or(session.current_model),
        None,
        &on_stream,
    ).await?;

    app.unlisten(event_id);

    Ok(ChatGenerationReturn {
        id: response_id,
        date_created: Utc::now(),
    })
}
