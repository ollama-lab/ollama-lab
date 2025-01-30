use std::{str::FromStr, sync::Arc};

use ollama_rest::{chrono::{DateTime, Local, Utc}, futures::StreamExt, models::chat::{ChatRequest, Message, Role}, Ollama};
use sqlx::{Pool, Sqlite};
use tokio::sync::{mpsc, oneshot, Mutex};

use crate::{errors::Error, events::StreamingResponseEvent, responses::tree::ChatTree};

pub async fn stream_response<'c>(
    ollama: &Ollama,
    conn_pool: &Pool<Sqlite>,
    chan_sender: mpsc::Sender<StreamingResponseEvent>,
    response_id: i64,
    cancel_receiver: Option<oneshot::Receiver<()>>,
    session_id: i64,
    current_model: &str,
) -> Result<(), Error> {
    let tx = chan_sender.clone();
    let tx2 = chan_sender.clone();

    let chat_history = ChatTree::new(session_id).current_branch(conn_pool, None, true).await?;

    let req = ChatRequest{
        model: current_model.to_string(),
        stream: None,
        format: None,
        tools: None,
        keep_alive: None,
        options: None,
        messages: chat_history
            .into_iter()
            .map(|item| Message{
                role: Role::from_str(item.role.as_str()).unwrap(),
                content: item.content,
                images: None,
                tool_calls: None,
            })
            .collect(),
    };

    let mut stream = ollama.chat_streamed(&req).await?;

    let output_buf = Arc::new(Mutex::new(String::new()));
    let output_buf2 = output_buf.clone();

    let thoughts_buf = Arc::new(Mutex::new(String::new()));
    let thoughts_buf2 = thoughts_buf.clone();

    let thought_for = Arc::new(Mutex::new(None::<i64>));
    let thought_for2 = thought_for.clone();

    let (result_tx, mut result_rx) = mpsc::channel(1);
    let result_tx2 = result_tx.clone();

    tokio::select! {
        Err(err) = async move {
            let mut date_now = Utc::now().timestamp();

            let mut thought_start_on: Option<DateTime<Local>> = None;
            let mut thought_already = false;

            'stream_loop: while let Some(Ok(res)) = stream.next().await {
                date_now = res.created_at.timestamp();

                if res.done {
                    chan_sender.send(StreamingResponseEvent::Done).await?;
                    continue;
                }

                let chunk = res.message
                    .map(|msg| msg.content)
                    .unwrap_or_else(|| String::new());

                if !thought_already {
                    if let Some(start_on) = thought_start_on {
                        match chunk.as_str() {
                            "</think>" => {
                                let tf_milli = res.created_at.timestamp_millis() - start_on.timestamp_millis();
                                chan_sender.send(StreamingResponseEvent::ThoughtEnd{
                                    thought_for: Some(tf_milli),
                                }).await?;
                                thought_start_on = None;
                                thought_already = true;

                                let mut tf = thought_for2.lock().await;
                                *tf = Some(tf_milli);

                                continue 'stream_loop;
                            }
                            _ => thoughts_buf2.lock().await.push_str(chunk.as_str()),
                        }

                    } else {
                        match chunk.as_str() {
                            "<think>" => {
                                chan_sender.send(StreamingResponseEvent::ThoughtBegin).await?;
                                thought_start_on = Some(res.created_at);
                                continue 'stream_loop;
                            }
                            _ => output_buf2.lock().await.push_str(chunk.as_str()),
                        }
                    }
                }

                chan_sender.send(StreamingResponseEvent::Text { chunk }).await?;
            }

            result_tx.send((date_now, true)).await?;

            Ok::<(), Error>(())
        } => {
            _ = tx.send(StreamingResponseEvent::Failure {
                message: Some(err.to_string()),
            }).await;

            result_tx2.send((Utc::now().timestamp(), false)).await?;
        }

        Some(res) = async move {
            match cancel_receiver {
                Some(rx) => Some(rx.await),
                None => None,
            }
        } => {
            if let Ok(_) = res {
                _ = tx2.send(StreamingResponseEvent::Canceled {
                    message: Some("Canceled by user.".to_string()),
                }).await;

                result_tx2.send((Utc::now().timestamp(), false)).await?;
            }
        }
    }

    if let Some((date_now, completed)) = result_rx.recv().await {
        let mut transaction = conn_pool.begin().await?;

        sqlx::query(r#"
            UPDATE chats
            SET date_created = $2, completed = $3, content = $4
            WHERE id = $1;
        "#)
            .bind(response_id).bind(date_now).bind(completed).bind(output_buf.lock().await.as_str())
            .execute(&mut *transaction)
            .await?;

        let thoughts_content_guard = thoughts_buf.lock().await;
        let trimmed_thoughts = thoughts_content_guard.as_str().trim();
        if !trimmed_thoughts.is_empty() {
            sqlx::query(r#"
                INSERT INTO cot_thoughts (chat_id, content, thoughts_for_milli)
                VALUES ($1, $2, $3);
            "#)
                .bind(response_id).bind(trimmed_thoughts).bind(thought_for.lock().await.take())
                .execute(&mut *transaction)
                .await?;
        }
        drop(thoughts_content_guard);

        transaction.commit().await?;
        result_rx.close();
    }

    Ok(())
}
