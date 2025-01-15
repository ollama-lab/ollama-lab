use std::{ops::Deref, sync::Arc};

use sqlx::SqlitePool;
use tauri::State;

use crate::{app_state::AppState, errors::Error, paths::db_path};

#[tauri::command]
pub async fn initialize(state: State<'_, Arc<AppState>>) -> Result<(), Error> {
    let mut cur_conn = state.deref().conn.lock().await;

    if cur_conn.is_none() {
        *cur_conn = Some(SqlitePool::connect(
            db_path()
                .as_ref()
                .and_then(|path| path.to_str())
                .ok_or(Error::NoDataPath)?
        ).await?);
    }

    Ok(())
}
