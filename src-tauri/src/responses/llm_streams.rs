use std::{str::FromStr, sync::Arc};

use ollama_rest::{chrono::Utc, futures::StreamExt, models::chat::{ChatRequest, Message, Role}, Ollama};
use sqlx::{Executor, Sqlite};
use tokio::sync::{mpsc, oneshot, Mutex};

use crate::{errors::Error, events::StreamingResponseEvent, responses::tree::ChatTree};

pub async fn stream_response<'c>(
    ollama: &Ollama,
    sqlx_executor: impl Executor<'c, Database = Sqlite> + Clone,
    chan_sender: mpsc::Sender<StreamingResponseEvent>,
    response_id: i64,
    cancel_receiver: Option<oneshot::Receiver<()>>,
    session_id: i64,
    current_model: &str,
) -> Result<(), Error> {
    let tx = chan_sender.clone();
    let tx2 = chan_sender.clone();

    let chat_history = ChatTree::new(session_id).current_branch(sqlx_executor.clone(), None, true).await?;

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

    let (result_tx, mut result_rx) = mpsc::channel(1);
    let result_tx2 = result_tx.clone();

    tokio::select! {
        Err(err) = async move {
            let mut date_now = Utc::now().timestamp();

            while let Some(Ok(res)) = stream.next().await {
                date_now = res.created_at.timestamp();

                if res.done {
                    chan_sender.send(StreamingResponseEvent::Done).await?;
                    continue;
                }

                let chunk = res.message
                    .map(|msg| msg.content)
                    .unwrap_or_else(|| String::new());

                output_buf2.lock().await.push_str(chunk.as_str());
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
        dbg!(completed);
        sqlx::query("\
            UPDATE chats
            SET date_created = $2, completed = $3, content = $4
            WHERE id = $1;
        ")
            .bind(response_id).bind(date_now).bind(completed).bind(output_buf.lock().await.as_str())
            .execute(sqlx_executor.clone())
            .await?;
        
        result_rx.close();
    }

    Ok(())
}
