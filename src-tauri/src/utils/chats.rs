use ollama_rest::{chrono::Utc, Ollama};
use sqlx::{Pool, Sqlite};
use tauri::ipc::Channel;
use tokio::sync::broadcast;

use crate::{
    chat_gen::utils::{
        add_assistant_prompt,
        add_generic_system_prompt,
        add_model_system_prompt,
        add_user_prompt,
        stream_via_channel,
        AssistantPromptAdditionReturn,
    },
    errors::Error,
    events::StreamingResponseEvent,
    models::{
        agent::{Agent, AgentSelector},
        chat::{ChatGenerationReturn, IncomingUserPrompt},
    },
    responses::tree::ChatTree,
};

use super::{crud::OperateCrud, sessions::get_session, system_prompt::get_session_system_prompt};

pub async fn launch_normal_chat(
    conn_pool: &Pool<Sqlite>,
    ollama: &Ollama,
    profile_id: i64,
    session_id: i64,
    parent_id: Option<i64>,
    prompt: IncomingUserPrompt,
    on_stream: Channel<StreamingResponseEvent>,
    reuse_sibling_images: bool,
    cancel_rx: Option<broadcast::Receiver<()>>,
) -> Result<ChatGenerationReturn, Error> {
    let session = get_session(conn_pool, profile_id, session_id)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);

    let mut tx = conn_pool.begin().await?;

    let mut parent_id = parent_id;

    if prompt.use_system_prompt.unwrap_or(false) && parent_id.is_none() {
        let ret = add_model_system_prompt(&tree, &mut tx, &on_stream, profile_id, session.current_model.as_str())
            .await?;

        if let Some(new_parent_id) = ret.parent_id {
            parent_id = Some(new_parent_id);
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

    let response_ret = add_assistant_prompt(
        &mut tx,
        &tree,
        parent_id,
        None,
        &session.current_model,
        &on_stream,
    ).await?;

    tx.commit().await?;

    let model = session.current_model.clone();
    let pool2 = conn_pool.clone();

    match stream_via_channel(
        ollama.clone(),
        pool2,
        response_ret.id,
        cancel_rx,
        session.id,
        model,
        None,
        &on_stream,
    ).await {
        Err(Error::ChatHalted) => {},
        other => other?,
    };

    Ok(ChatGenerationReturn {
        id: response_ret.id,
        date_created: Utc::now(),
    })
}

pub async fn launch_h2h_chat(
    conn_pool: &Pool<Sqlite>,
    ollama: &Ollama,
    profile_id: i64,
    session_id: i64,
    parent_id: Option<i64>,
    prompt: IncomingUserPrompt,
    on_stream: Channel<StreamingResponseEvent>,
    reuse_sibling_images: bool,
    cancel_tx: Option<&broadcast::Sender<()>>,
) -> Result<ChatGenerationReturn, Error> {
    let session = get_session(conn_pool, profile_id, session_id)
        .await?
        .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(session_id);

    let mut tx = conn_pool.begin().await?;

    let mut parent_id = parent_id;

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

    let agents = Agent::list_all(conn_pool, AgentSelector::BySession(session_id)).await?;
    let mut agent_index = 0;

    if !agents.is_empty() {
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

        let cancel_rx = cancel_tx.map(|tx| tx.subscribe());

        let mut tx = conn_pool.begin().await?;

        if let Some(indicator) = cur_agent.map(|item| format!("{} is talking", item.display_name())) {
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
        
        response_ret = add_assistant_prompt(
            &mut tx,
            &tree,
            parent_id,
            cur_agent.map(|agent| agent.id),
            model.as_str(),
            &on_stream,
        ).await?;

        tx.commit().await?;

        parent_id = Some(response_ret.id);

        let result = stream_via_channel(
            ollama.clone(),
            conn_pool.clone(),
            response_ret.id,
            cancel_rx,
            session.id,
            model,
            cur_agent.map(|agent| agent.id),
            &on_stream,
        ).await;

        match result {
            Err(Error::ChatHalted) => {
                break;
            }

            other => other?,
        };

        if !agents.is_empty() {
            agent_index = (agent_index + 1) % agents.len();
        }
    }

    Ok(ChatGenerationReturn {
        id: response_ret.id,
        date_created: Utc::now(),
    })
}
