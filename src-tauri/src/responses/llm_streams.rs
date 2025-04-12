use std::{collections::HashMap, str::FromStr, sync::Arc};

use ollama_rest::{
    chrono::{DateTime, Local, Utc},
    futures::StreamExt,
    models::chat::{ChatRequest, Message, Role},
    Ollama,
};
use sqlx::{Pool, Sqlite};
use tokio::sync::{broadcast, mpsc, Mutex};

use crate::{
    chat_gen::ego::IntoEgoOf,
    errors::Error,
    events::StreamingResponseEvent,
    responses::tree::ChatTree,
    utils::images::get_chat_images
};

async fn record_assistant_response(
    final_date_now: Arc<Mutex<Option<(i64, bool)>>>,
    pool: &Pool<Sqlite>,
    response_id: i64,
    output_buf: Arc<Mutex<String>>,
    thoughts_buf: Arc<Mutex<String>>,
    thought_for: Arc<Mutex<Option<i64>>>,
) -> Result<(), Error> {
    let (date_now, completed) = final_date_now
        .lock()
        .await
        .unwrap_or_else(|| (Utc::now().timestamp(), true));
    let mut transaction = pool.begin().await?;

    sqlx::query(
        r#"
        UPDATE chats
        SET date_created = $2, completed = $3, content = $4
        WHERE id = $1;
    "#,
    )
    .bind(response_id)
    .bind(date_now)
    .bind(completed)
    .bind(output_buf.lock().await.as_str())
    .execute(&mut *transaction)
    .await?;

    let thoughts_content_guard = thoughts_buf.lock().await;
    let trimmed_thoughts = thoughts_content_guard.as_str().trim();
    if !trimmed_thoughts.is_empty() {
        sqlx::query(
            r#"
            INSERT INTO cot_thoughts (chat_id, content, thought_for_milli)
            VALUES ($1, $2, $3);
        "#,
        )
        .bind(response_id)
        .bind(trimmed_thoughts)
        .bind(thought_for.lock().await.take())
        .execute(&mut *transaction)
        .await?;
    }

    transaction.commit().await?;
    Ok(())
}

pub async fn stream_response(
    ollama: &Ollama,
    pool: &Pool<Sqlite>,
    chan_sender: mpsc::Sender<StreamingResponseEvent>,
    response_id: i64,
    cancel_receiver: Option<broadcast::Receiver<()>>,
    session_id: i64,
    current_model: &str,
    agent_id: Option<i64>,
) -> Result<(), Error> {
    let tx = chan_sender.clone();
    let tx2 = chan_sender.clone();

    let mut chat_history = ChatTree::new(session_id)
        .current_branch(pool, None, true)
        .await?;

    if let Some(agent_id) = agent_id {
        chat_history = chat_history.into_ego_of(agent_id);
    }

    let mut image_map: HashMap<i64, Vec<String>> = HashMap::new();

    for chat in chat_history.iter() {
        if chat.image_count.unwrap_or(0) < 1 {
            continue;
        }

        let images: Vec<String> = get_chat_images(pool, chat.id, None).await?
            .into_iter()
            .map(|item| item.base64)
            .collect();

        if !images.is_empty() {
            image_map.insert(chat.id, images);
        }
    }

    let req = ChatRequest {
        model: current_model.to_string(),
        stream: None,
        format: None,
        tools: None,
        keep_alive: None,
        options: None,
        messages: chat_history
            .into_iter()
            .map(|item| Message {
                role: Role::from_str(item.role.as_str()).unwrap(),
                content: item.content,
                images: image_map.remove(&item.id),
                tool_calls: None,
            })
            .collect(),
    };

    let mut stream = ollama.chat_streamed(&req).await?;

    let output_buf = Arc::new(Mutex::new(String::new()));
    let output_buf2 = output_buf.clone();
    let output_buf3 = output_buf.clone();

    let thoughts_buf = Arc::new(Mutex::new(String::new()));
    let thoughts_buf2 = thoughts_buf.clone();
    let thoughts_buf3 = thoughts_buf.clone();

    let thought_for = Arc::new(Mutex::new(None::<i64>));
    let thought_for2 = thought_for.clone();
    let thought_for3 = thought_for.clone();

    let final_date_now = Arc::new(Mutex::new(None::<(i64, bool)>));
    let final_date_now2 = final_date_now.clone();
    let final_date_now3 = final_date_now.clone();
    let final_date_now4 = final_date_now.clone();

    tokio::select! {
        Err(err) = async move {
            // None if it is in the first text chunk
            let mut date_now = None::<i64>;

            let mut thought_start_on: Option<DateTime<Local>> = None;

            while let Some(Ok(res)) = stream.next().await {
                if res.done {
                    chan_sender.send(StreamingResponseEvent::Done).await?;
                    date_now = Some(res.created_at.timestamp());
                    break;
                }

                let chunk = res.message
                    .map(|msg| msg.content)
                    .unwrap_or_else(|| String::new());

                match thought_start_on {
                    Some(start_on) => {
                        match chunk.as_str() {
                            // Match closing tag (i.e. `</think>`)
                            "</think>" => {
                                let tf_milli = res.created_at.timestamp_millis() - start_on.timestamp_millis();
                                let mut tf = thought_for2.lock().await;
                                *tf = Some(tf_milli);

                                thought_start_on = None;

                                chan_sender.send(StreamingResponseEvent::ThoughtEnd{
                                    thought_for: Some(tf_milli),
                                }).await?;
                            }
                            _ => {
                                thoughts_buf2.lock().await.push_str(chunk.as_str());
                                chan_sender.send(StreamingResponseEvent::Text { chunk }).await?;
                            }
                        }
                    }
                    _ => {
                        match chunk.as_str() {
                            // Match leading `<think>` tag
                            "<think>" if date_now.is_none() => {
                                thought_start_on = Some(res.created_at);
                                chan_sender.send(StreamingResponseEvent::ThoughtBegin).await?;
                            }

                            chunk_str => {
                                output_buf2.lock().await.push_str(chunk_str);
                                chan_sender.send(StreamingResponseEvent::Text{ chunk }).await?;
                            }
                        }
                    }
                }

                date_now = Some(res.created_at.timestamp());
            }

            if let Some(date_now) = date_now {
                *final_date_now2.lock().await = Some((date_now, true));
            }

            // TODO: Figure out the bug that this is not working in normal mode
            record_assistant_response(final_date_now4, pool, response_id, output_buf3, thoughts_buf3, thought_for3)
                .await?;

            Ok::<(), Error>(())
        } => {
            tx.send(StreamingResponseEvent::Failure {
                message: Some(err.to_string()),
            }).await?;

            *final_date_now3.lock().await = Some((Utc::now().timestamp(), false));
        }

        Some(res) = async move {
            match cancel_receiver {
                Some(mut rx) => Some(rx.recv().await),
                None => None,
            }
        } => {
            if let Ok(_) = res {
                tx2.send(StreamingResponseEvent::Canceled {
                    message: Some("Canceled by user.".to_string()),
                }).await?;

                *final_date_now3.lock().await = Some((Utc::now().timestamp(), false));
            }
        }
    }

    
    // TODO: Figure out the bug that this is not working in H2H mode
    record_assistant_response(final_date_now, pool, response_id, output_buf, thoughts_buf, thought_for)
        .await?;

    Ok(())
}
