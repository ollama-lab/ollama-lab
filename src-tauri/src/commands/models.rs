use ollama_rest::{
    futures::StreamExt,
    models::model::{
        ModelCopyRequest, ModelDeletionRequest, ModelListResponse, ModelShowRequest,
        ModelShowResponse, ModelSyncRequest, RunningModelResponse,
    },
};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{app_state::AppState, errors::Error, events::ProgressEvent};

#[tauri::command]
pub async fn list_local_models(
    state: State<'_, AppState>,
) -> Result<ModelListResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama.local_models().await?)
}

#[tauri::command]
pub async fn list_running_models(
    state: State<'_, AppState>,
) -> Result<RunningModelResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama.running_models().await?)
}

#[tauri::command]
pub async fn get_model(
    state: State<'_, AppState>,
    name: String,
) -> Result<ModelShowResponse, Error> {
    let ollama = &state.ollama;
    Ok(ollama
        .model(&ModelShowRequest {
            name,
            verbose: None,
        })
        .await?)
}

#[tauri::command]
pub async fn get_default_model(state: State<'_, AppState>) -> Result<Option<String>, Error> {
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let row: Option<(String,)> =
        match sqlx::query_as("SELECT model FROM default_models WHERE profile_id = $1")
            .bind(state.profile)
            .fetch_one(conn)
            .await
        {
            Ok(data) => Some(data),
            Err(err) => match err {
                sqlx::Error::RowNotFound => None,
                _ => Err(err)?,
            },
        };

    Ok(row.map(|item| item.0))
}

#[tauri::command]
pub async fn set_default_model(
    state: State<'_, AppState>,
    new_model: String,
) -> Result<(), Error> {
    let profile_id = state.profile;

    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    sqlx::query(
        "INSERT INTO default_models (profile_id, model) VALUES ($1, $2) \
        ON CONFLICT (profile_id) \
        DO UPDATE SET model = $2",
    )
    .bind(profile_id)
    .bind(new_model)
    .execute(conn)
    .await?;

    Ok(())
}

#[tauri::command]
pub async fn copy_model(
    state: State<'_, AppState>,
    source: String,
    destination: String,
) -> Result<(), Error> {
    let ollama = &state.ollama;

    ollama
        .copy_model(&ModelCopyRequest {
            source,
            destination,
        })
        .await?;

    Ok(())
}

#[tauri::command]
pub async fn delete_model(state: State<'_, AppState>, model: String) -> Result<(), Error> {
    let ollama = &state.ollama;

    ollama
        .delete_model(&ModelDeletionRequest { name: model })
        .await?;

    Ok(())
}

#[tauri::command]
pub async fn pull_model(
    app: AppHandle,
    state: State<'_, AppState>,
    model: String,
    on_pull: Channel<ProgressEvent<'_>>,
) -> Result<(), Error> {
    let ollama = &state.ollama;

    let (cancel_tx, cancel_rx) = oneshot::channel();
    let mut is_canceled = false;

    let event_id = app.once(format!("cancel-pull/{}", model), |_| {
        cancel_tx.send(()).unwrap();
    });

    let (tx, mut rx) = mpsc::channel(16);

    let id = "pull";

    tokio::select! {
        Err(err) = async move {
            let mut stream = ollama
                .pull_model_streamed(&ModelSyncRequest {
                    name: model.clone(),
                    stream: None,
                    insecure: None,
                })
                .await?;

            while let Some(Ok(res)) = stream.next().await {
                tx.send(res).await?;
            }

            Ok::<(), Error>(())
        } => {
            app.unlisten(event_id);
            Err(err)?;
        }

        _ = cancel_rx => {
            is_canceled = true;
        }
    }

    while let Some(res) = rx.recv().await {
        on_pull.send(ProgressEvent::InProgress {
            id,
            message: res.status.as_str(),
            total: res.download_info.as_ref().map(|d| d.total),
            completed: res.download_info.as_ref().and_then(|d| d.completed),
        })?;
    }

    app.unlisten(event_id);

    on_pull.send(if is_canceled {
        ProgressEvent::Canceled { id, message: Some("Canceled by user.") }
    } else {
        ProgressEvent::Success { id }
    })?;

    Ok(())
}
