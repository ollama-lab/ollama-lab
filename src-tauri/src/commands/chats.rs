use std::str::FromStr;

use ollama_rest::{chrono::Utc, models::chat::Role};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::oneshot;

use crate::{
    app_state::AppState,
    chat_gen::utils::{
        add_assistent_prompt, add_generic_system_prompt, add_model_system_prompt, add_user_prompt, stream_via_channel, AssistantPromptAdditionReturn
    },
    errors::Error,
    events::StreamingResponseEvent,
    models::chat::{ChatGenerationReturn, IncomingUserPrompt},
    responses::tree::ChatTree,
    utils::{h2h::list_agents, sessions::get_session, system_prompt::get_session_system_prompt},
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
    is_h2h: bool,
) -> Result<ChatGenerationReturn, Error> {
    let ollama = &state.ollama;
    let profile_id = state.profile;
    let pool = state.conn_pool.clone();

    let session = get_session(&pool, profile_id, session_id)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);

    let mut tx = pool.begin().await?;

    let mut parent_id = parent_id;

    if prompt.use_system_prompt.unwrap_or(false) && parent_id.is_none() {
        let ret = add_model_system_prompt(&tree, &mut tx, &on_stream, profile_id, session.current_model.as_str())
            .await?;

        if let Some(new_parent_id) = ret.parent_id {
            parent_id = Some(new_parent_id);
        }
    }

    if is_h2h {
        if let Some(system_prompt) = get_session_system_prompt(session_id, &mut *tx).await? {
            let ret = add_generic_system_prompt(
                &tree,
                &mut tx,
                &on_stream,
                parent_id,
                system_prompt,
                true,
                None,
                None,
            ).await?;

            parent_id = ret.parent_id;
        }
    }

    if !prompt.text.is_empty() {
        let user_chat_ret = add_user_prompt(
            &mut tx,
            &tree,
            parent_id,
            prompt.text.as_str(),
            prompt.image_paths,
            &on_stream,
            reuse_sibling_images,
        ).await?;

        parent_id = Some(user_chat_ret.id);
    }

    let mut response_ret: AssistantPromptAdditionReturn;

    let agents = list_agents(profile_id, &pool).await?;
    let mut agent_index = 0;

    if is_h2h && !agents.is_empty() {
        for agent in agents.iter() {
            if let Some(prompt) = agent.system_prompt.clone() {
                let ret = add_generic_system_prompt(
                    &tree,
                    &mut tx,
                    &on_stream,
                    parent_id,
                    prompt,
                    true,
                    Some(agent.id),
                    Some(agent.display_name()),
                ).await?;

                parent_id = ret.parent_id;
            }
        }
    }

    tx.commit().await?;

    loop {
        let cur_agent = agents.get(agent_index);
        let model = session.current_model.clone();

        let pool2 = pool.clone();

        let (cancel_tx, cancel_rx) = oneshot::channel();

        let event_id = app.once("cancel-gen", move |_| {
            cancel_tx.send(()).unwrap();
        });

        let mut tx = pool2.begin().await?;

        if let Some(indicator) = cur_agent.map(|item| format!("({} is talking)", item.display_name())) {
            let indicator_ret = add_generic_system_prompt(
                &tree,
                &mut tx,
                &on_stream,
                parent_id,
                indicator,
                true,
                None,
                None,
            ).await?;

            parent_id = indicator_ret.parent_id;
        }
        
        response_ret = add_assistent_prompt(
            &mut tx,
            &tree,
            parent_id,
            cur_agent.map(|agent| agent.id),
            model.as_str(),
            &on_stream,
        ).await?;

        tx.commit().await?;

        parent_id = Some(response_ret.id);

        let is_finished = stream_via_channel(
            ollama.clone(),
            pool2,
            response_ret.id,
            cancel_rx,
            session.id,
            model,
            cur_agent.map(|agent| agent.id),
            &on_stream,
        ).await?;

        app.unlisten(event_id);

        if !is_finished {
            break;
        }

        if !is_h2h {
            break;
        }
        
        if !agents.is_empty() {
            agent_index = (agent_index + 1) % agents.len();
        }
    }

    Ok(ChatGenerationReturn {
        id: response_ret.id,
        date_created: Utc::now(),
    })
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

            let ret = add_assistent_prompt(
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

    let (cancel_tx, cancel_rx) = oneshot::channel();

    let event_id = app.once("cancel-gen", move |_| {
        cancel_tx.send(()).unwrap();
    });

    stream_via_channel(
        ollama.clone(),
        pool,
        response_id,
        cancel_rx,
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
