use ollama_rest::{models::chat::Role, Ollama};
use sqlx::{Pool, Sqlite, Transaction};
use tauri::ipc::Channel;
use tokio::sync::{mpsc, oneshot};

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

pub async fn add_system_prompt(
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
                    h2h_agent_id: None,
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
            h2h_agent_id: None,
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
                h2h_agent_id: agent_id,
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
    cancel_rx: oneshot::Receiver<()>,
    session_id: i64,
    model: String,
    channel: &ResponseStreamingChannel,
) -> Result<(), Error> {
    // Text streaming channel
    let (tx, mut rx) = mpsc::channel(32);

    tokio::spawn(async move {
        stream_response(
            &ollama,
            &pool,
            tx.clone(),
            response_id,
            Some(cancel_rx),
            session_id,
            model.as_str(),
        )
        .await
        .unwrap();
    });

    while let Some(event) = rx.recv().await {
        match event {
            StreamingResponseEvent::Done
            | StreamingResponseEvent::Failure { .. }
            | StreamingResponseEvent::Canceled { .. } => {
                rx.close();
            }
            _ => {}
        }

        channel.send(event)?;
    }

    Ok(())
}
