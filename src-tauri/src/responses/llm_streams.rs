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

#[derive(Clone, Copy, Default)]
struct ChatMetrics {
    total_duration: Option<u64>,
    load_duration: Option<u64>,
    prompt_eval_count: Option<usize>,
    prompt_eval_duration: Option<u64>,
    eval_count: Option<usize>,
    eval_duration: Option<u64>,
}

async fn record_assistant_response(
    final_date_now: Arc<Mutex<Option<(i64, bool)>>>,
    pool: &Pool<Sqlite>,
    response_id: i64,
    output_buf: Arc<Mutex<String>>,
    thoughts_buf: Arc<Mutex<String>>,
    thought_for: Arc<Mutex<Option<i64>>>,
    metrics: Arc<Mutex<Option<ChatMetrics>>>,
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

    if let Some(metrics) = metrics.lock().await.take() {
        let total_duration = metrics.total_duration.and_then(|n| i64::try_from(n).ok());
        let load_duration = metrics.load_duration.and_then(|n| i64::try_from(n).ok());
        let prompt_eval_count = metrics.prompt_eval_count.and_then(|n| i64::try_from(n).ok());
        let prompt_eval_duration = metrics.prompt_eval_duration.and_then(|n| i64::try_from(n).ok());
        let eval_count = metrics.eval_count.and_then(|n| i64::try_from(n).ok());
        let eval_duration = metrics.eval_duration.and_then(|n| i64::try_from(n).ok());

        if total_duration.is_some()
            || load_duration.is_some()
            || prompt_eval_count.is_some()
            || prompt_eval_duration.is_some()
            || eval_count.is_some()
            || eval_duration.is_some()
        {
            sqlx::query(
                r#"
                INSERT INTO chat_metrics (
                    chat_id,
                    total_duration_nano,
                    load_duration_nano,
                    prompt_eval_count,
                    prompt_eval_duration_nano,
                    eval_count,
                    eval_duration_nano
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT(chat_id) DO UPDATE SET
                    total_duration_nano = excluded.total_duration_nano,
                    load_duration_nano = excluded.load_duration_nano,
                    prompt_eval_count = excluded.prompt_eval_count,
                    prompt_eval_duration_nano = excluded.prompt_eval_duration_nano,
                    eval_count = excluded.eval_count,
                    eval_duration_nano = excluded.eval_duration_nano;
            "#,
            )
            .bind(response_id)
            .bind(total_duration)
            .bind(load_duration)
            .bind(prompt_eval_count)
            .bind(prompt_eval_duration)
            .bind(eval_count)
            .bind(eval_duration)
            .execute(&mut *transaction)
            .await?;
        }
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
        think: None,
        messages: chat_history
            .into_iter()
            .map(|item| Message {
                role: Role::from_str(item.role.as_str()).unwrap(),
                content: item.content,
                images: image_map.remove(&item.id),
                tool_calls: None,
                thinking: item.thoughts,
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

    let metrics = Arc::new(Mutex::new(None::<ChatMetrics>));
    let metrics2 = metrics.clone();
    let metrics3 = metrics.clone();
    let metrics4 = metrics.clone();

    tokio::select! {
        Err(err) = async move {
            // None if it is in the first text chunk
            let mut date_now = None::<i64>;

            let mut thinking_start_on: Option<DateTime<Local>> = None;

            while let Some(Ok(res)) = stream.next().await {
                if res.done {
                    let done_metrics = ChatMetrics {
                        total_duration: res.total_duration,
                        load_duration: res.load_duration,
                        prompt_eval_count: res.prompt_eval_count,
                        prompt_eval_duration: res.prompt_eval_duration,
                        eval_count: res.eval_count,
                        eval_duration: res.eval_duration,
                    };

                    *metrics2.lock().await = Some(done_metrics);

                    chan_sender
                        .send(StreamingResponseEvent::Done {
                            total_duration: done_metrics.total_duration,
                            load_duration: done_metrics.load_duration,
                            prompt_eval_count: done_metrics.prompt_eval_count,
                            prompt_eval_duration: done_metrics.prompt_eval_duration,
                            eval_count: done_metrics.eval_count,
                            eval_duration: done_metrics.eval_duration,
                        })
                        .await?;
                    date_now = Some(res.created_at.timestamp());
                    break;
                }

                if let Some(msg) = res.message {
                    match msg.thinking {
                        Some(think_chunk) => {
                            if thinking_start_on.is_none() {
                                thinking_start_on = Some(res.created_at);
                                chan_sender.send(StreamingResponseEvent::ThoughtBegin).await?;
                            }

                            thoughts_buf2.lock().await.push_str(&think_chunk);
                            chan_sender.send(StreamingResponseEvent::Text { chunk: think_chunk }).await?;
                        }

                        None => {
                            if let Some(start_on) = thinking_start_on {
                                let tf_milli = res.created_at.timestamp_millis() - start_on.timestamp_millis();
                                let mut tf = thought_for2.lock().await;
                                *tf = Some(tf_milli);

                                thinking_start_on = None;

                                chan_sender.send(StreamingResponseEvent::ThoughtEnd{
                                    thought_for: Some(tf_milli),
                                }).await?;
                            }

                            let chunk = msg.content;
                            output_buf2.lock().await.push_str(&chunk);
                            chan_sender.send(StreamingResponseEvent::Text { chunk }).await?;
                        }
                    }

                }

                date_now = Some(res.created_at.timestamp());
            }

            if let Some(date_now) = date_now {
                *final_date_now2.lock().await = Some((date_now, true));
            }

            // TODO: Figure out the bug that this is not working in normal mode
            record_assistant_response(
                final_date_now4,
                pool,
                response_id,
                output_buf3,
                thoughts_buf3,
                thought_for3,
                metrics4,
            )
                .await?;

            Ok::<(), Error>(())
        } => {
            tx.send(StreamingResponseEvent::Failure {
                message: Some(err.to_string()),
            }).await?;

            *final_date_now3.lock().await = Some((Utc::now().timestamp(), false));
            _ = metrics3.lock().await.take();
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
                _ = metrics3.lock().await.take();
            }
        }
    }

    
    // TODO: Figure out the bug that this is not working in H2H mode
    record_assistant_response(
        final_date_now,
        pool,
        response_id,
        output_buf,
        thoughts_buf,
        thought_for,
        metrics,
    )
        .await?;

    Ok(())
}
