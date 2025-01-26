use ollama_rest::{
    futures::StreamExt,
    models::model::{
        ModelCopyRequest, ModelDeletionRequest, ModelListResponse, ModelShowRequest,
        ModelShowResponse, ModelSyncRequest, RunningModelResponse,
    },
};
use tauri::{ipc::Channel, AppHandle, Listener, State};
use tokio::sync::{mpsc, oneshot};

use crate::{app_state::AppState, errors::Error, events::ProgressEvent, strings::ToEventString, utils::connections::ConvertMutexContentAsync};

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
    let mut conn = state.conn_pool.convert_to().await?;

    let row = sqlx::query_as::<_, (String,)>("SELECT model FROM default_models WHERE profile_id = $1")
        .bind(state.profile)
        .fetch_optional(&mut *conn)
        .await?;

    Ok(row.map(|tuple| tuple.0))
}

#[tauri::command]
pub async fn set_default_model(
    state: State<'_, AppState>,
    new_model: String,
) -> Result<(), Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.convert_to().await?;

    sqlx::query(
        "INSERT INTO default_models (profile_id, model) VALUES ($1, $2) \
        ON CONFLICT (profile_id) \
        DO UPDATE SET model = $2",
    )
    .bind(profile_id)
    .bind(new_model)
    .execute(&mut *conn)
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

    let event_id = app.once(format!("cancel-pull/{}", model.to_event_string()), |_| {
        cancel_tx.send(()).unwrap();
    });

    let (tx, mut rx) = mpsc::channel(8);

    let id = "pull";

    let mut stream = ollama
        .pull_model_streamed(&ModelSyncRequest {
            name: model.clone(),
            stream: None,
            insecure: None,
        })
        .await?;

    tokio::spawn(async move {
        let tx2 = tx.clone();
        let tx3 = tx.clone();

        tokio::select! {
            Err(err) = async move {
                while let Some(Ok(res)) = stream.next().await {
                    tx2.send(ProgressEvent::InProgress {
                        id,
                        message: res.status,
                        total: res.download_info.as_ref().map(|d| d.total),
                        completed: res.download_info.as_ref().and_then(|d| d.completed),
                    }).await?;
                }

                tx2.send(ProgressEvent::Success { id }).await?;
                Ok::<(), Error>(())
            } => {
                _ = tx.send(ProgressEvent::Failure {
                    id,
                    message: Some(err.to_string()),
                }).await;
            }

            _ = cancel_rx => {
                _ = tx3.send(ProgressEvent::Canceled { id, message: Some("Canceled by user".to_string()) })
                    .await;
            }
        }
    });

    while let Some(info) = rx.recv().await {
        match info {
            ProgressEvent::InProgress { .. } => {}
            _ => {
                rx.close();
            }
        }

        on_pull.send(info)?;
    }

    app.unlisten(event_id);
    Ok(())
}
