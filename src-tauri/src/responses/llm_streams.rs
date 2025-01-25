use std::{str::FromStr, sync::Arc};

use ollama_rest::{chrono::Utc, futures::StreamExt, models::chat::{ChatRequest, Message, Role}, Ollama};
use sqlx::{Executor, Sqlite};
use tokio::sync::{mpsc, oneshot, Mutex};

use crate::{errors::Error, events::StreamingResponseEvent, models::chat::Chat};

pub async fn stream_response<'c>(
    ollama: Ollama,
    sqlx_executor: impl Executor<'c, Database = Sqlite> + Clone,
    chan_sender: mpsc::Sender<StreamingResponseEvent>,
    response_id: i64,
    cancel_receiver: Option<oneshot::Receiver<()>>,
    session_id: i64,
    current_model: &str,
) -> Result<(), Error> {
    let tx = chan_sender.clone();
    let tx2 = chan_sender.clone();

    let chat_history = sqlx::query_as::<_, Chat>("\
        SELECT id, session_id, role, content, completed, date_created, date_edited, model
        FROM chats
        WHERE session_id = $1 AND completed = TRUE 
        ORDER BY date_created, id;
    ")
        .bind(session_id)
        .fetch_all(sqlx_executor.clone())
        .await?;

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

    let conn1 = sqlx_executor.clone();
    let conn2 = sqlx_executor.clone();

    tokio::select! {
        Err(err) = async move {
            let mut date_now = Utc::now().timestamp();

            while let Some(Ok(res)) = stream.next().await {
                date_now = res.created_at.to_utc().timestamp();

                if res.done {
                    chan_sender.send(StreamingResponseEvent::Done).await?;
                    continue;
                }

                let chunk = res.message
                    .map(|msg| msg.content)
                    .unwrap_or_else(|| String::new());

                output_buf.lock().await.push_str(chunk.as_str());
                chan_sender.send(StreamingResponseEvent::Text { chunk }).await?;
            }

            sqlx::query("\
                UPDATE chats
                SET date_created = $2, completed = TRUE, content = $3
                WHERE id = $1;
            ")
                .bind(response_id).bind(date_now).bind(output_buf.lock().await.as_str())
                .execute(conn1)
                .await?;

            Ok::<(), Error>(())
        } => {
            _ = tx.send(StreamingResponseEvent::Failure {
                message: Some(err.to_string()),
            }).await;
        }

        Some(_) = async move {
            match cancel_receiver {
                Some(rx) => Some(rx.await),
                None => None,
            }
        } => {
            _ = tx2.send(StreamingResponseEvent::Canceled {
                message: Some("Canceled by user.".to_string()),
            }).await;

            _ = sqlx::query("\
                UPDATE chats
                SET date_created = $2, completed = FALSE, content = $3
                WHERE id = $1;
            ")
                .bind(response_id)
                .bind(Utc::now().timestamp())
                .bind(output_buf2.lock().await.as_str())
                .execute(conn2)
                .await;
        }
    }

    Ok(())
}
