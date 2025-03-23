use ollama_rest::{models::chat::Role, Ollama};
use sqlx::{Pool, Sqlite, Transaction};
use tauri::ipc::Channel;
use tokio::sync::{broadcast, mpsc};

use crate::{
    errors::Error,
    events::StreamingResponseEvent,
    image::get_image_paths_of_last_sibling,
    responses::{
        llm_streams::stream_response,
        tree::{models::NewChildNode, ChatTree}
    },
    utils::system_prompt::get_system_prompt,
};

type ResponseStreamingChannel = Channel<StreamingResponseEvent>;

pub struct SystemPromptAdditionReturn {
    pub parent_id: Option<i64>,
}

pub async fn add_model_system_prompt(
    tree: &ChatTree,
    tx: &mut Transaction<'_, Sqlite>,
    channel: &ResponseStreamingChannel,
    profile_id: i64,
    model: &str,
) -> Result<SystemPromptAdditionReturn, Error> {
    let content = get_system_prompt(profile_id, model, &mut **tx)
        .await?;

    let mut ret = SystemPromptAdditionReturn{
        parent_id: None,
    };

    if let Some(content) = content {
        let system_prompt_ret = tree
            .new_child(
                tx,
                None,
                NewChildNode {
                    content: content.as_str(),
                    role: Role::System,
                    model: None,
                    completed: true,
                    images: None,
                    agent_id: None,
                },
            )
            .await?;

        ret.parent_id = Some(system_prompt_ret.0);
        channel.send(StreamingResponseEvent::SystemPrompt {
            id: system_prompt_ret.0,
            text: content,
        })?;
    }

    Ok(ret)
}

pub async fn add_generic_system_prompt(
    tree: &ChatTree,
    tx: &mut Transaction<'_, Sqlite>,
    channel: &ResponseStreamingChannel,
    parent_id: Option<i64>,
    system_prompt: String,
    completed: bool,
    agent_id: Option<i64>,
    agent_name: Option<&str>,
) -> Result<SystemPromptAdditionReturn, Error> {
    let ret = tree.new_child(
        tx,
        parent_id,
        NewChildNode {
            content: system_prompt.as_str(),
            role: Role::System,
            model: None,
            completed,
            images: None,
            agent_id,
        },
    ).await?;

    channel.send(StreamingResponseEvent::SystemPrompt {
        id: ret.0,
        text: if let Some(agent_name) = agent_name {
            format!("{}: {}", agent_name, system_prompt)
        } else {
            system_prompt
        },
    })?;

    Ok(SystemPromptAdditionReturn{ parent_id: Some(ret.0) })
}

pub struct UserPromptAdditionReturn {
    pub id: i64,
}

pub async fn add_user_prompt(
    tx: &mut Transaction<'_, Sqlite>,
    tree: &ChatTree,
    parent_id: Option<i64>,
    prompt_text: &str,
    image_paths: Option<Vec<String>>,
    channel: &ResponseStreamingChannel,
    reuse_sibling_images: bool,
) -> Result<UserPromptAdditionReturn, Error> {
    let sibling_image_paths: Option<Vec<String>>;
    let mut image_ref_paths = image_paths
        .as_ref()
        .and_then(|path_list| Some(
            path_list.iter()
                .map(|s| s.as_str())
                .collect::<Vec<&str>>()
        ));

    if reuse_sibling_images && image_ref_paths.as_ref().is_none_or(|list| list.is_empty()) {
        sibling_image_paths = Some(get_image_paths_of_last_sibling(&mut **tx, parent_id).await?);
        image_ref_paths = sibling_image_paths
            .as_ref()
            .map(|paths| {
                paths.iter().map(|s| s.as_str()).collect()
            });
    }

    let ret_tuple = tree.new_child(
        tx,
        parent_id,
        NewChildNode {
            model: None,
            role: Role::User,
            content: prompt_text,
            completed: true,
            images: image_ref_paths.as_ref().map(|inner| inner.as_slice()),
            agent_id: None,
        },
    )
    .await?;

    channel.send(StreamingResponseEvent::UserPrompt {
        id: ret_tuple.0,
        images: image_paths,
        timestamp: ret_tuple.1,
    })?;

    Ok(UserPromptAdditionReturn{ id: ret_tuple.0 })
}

pub struct AssistantPromptAdditionReturn {
    pub id: i64,
}

pub async fn add_assistent_prompt(
    tx: &mut Transaction<'_, Sqlite>,
    tree: &ChatTree,
    parent_id: Option<i64>,
    agent_id: Option<i64>,
    model: &str,
    channel: &ResponseStreamingChannel,
) -> Result<AssistantPromptAdditionReturn, Error> {
    let ret_tuple = tree
        .new_child(
            tx,
            parent_id,
            NewChildNode {
                content: "",
                role: Role::Assistant,
                model: Some(model),
                completed: false,
                images: None,
                agent_id,
            },
        )
        .await?;

    channel.send(StreamingResponseEvent::ResponseInfo { id: ret_tuple.0 })?;
    Ok(AssistantPromptAdditionReturn{ id: ret_tuple.0 })
}

pub async fn stream_via_channel(
    ollama: Ollama,
    pool: Pool<Sqlite>,
    response_id: i64,
    cancel_rx: Option<broadcast::Receiver<()>>,
    session_id: i64,
    model: String,
    agent_id: Option<i64>,
    channel: &ResponseStreamingChannel,
) -> Result<(), Error> {
    // Text streaming channel
    let (tx, mut rx) = mpsc::channel(32);
    let mut is_finished = false;

    tokio::spawn(async move {
        stream_response(
            &ollama,
            &pool,
            tx.clone(),
            response_id,
            cancel_rx,
            session_id,
            model.as_str(),
            agent_id,
        )
        .await
        .unwrap();
    });

    while let Some(event) = rx.recv().await {
        match event {
            StreamingResponseEvent::Done => {
                is_finished = true;
                rx.close();
            }
            StreamingResponseEvent::Failure { .. }
            | StreamingResponseEvent::Canceled { .. } => {
                rx.close();
            }
            _ => {}
        }

        channel.send(event)?;
    }

    if is_finished {
        Ok(())
    } else {
        Err(Error::ChatHalted)
    }
}

pub async fn set_complete(chat_id: i64, tx: &mut Transaction<'_, Sqlite>) -> Result<(), Error> {
    sqlx::query(r#"
        UPDATE chats
        SET completed = TRUE
        WHERE id = $1;
    "#)
        .bind(chat_id)
        .execute(&mut **tx)
        .await?;

    Ok(())
}
