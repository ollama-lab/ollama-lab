use std::{io::ErrorKind, ops::Deref};

use sqlx::SqlitePool;
use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    paths::{db_path, local_data_dir},
};

#[tauri::command]
pub async fn initialize(state: State<'_, AppState>) -> Result<(), Error> {
    let mut cur_conn = state.deref().conn.lock().await;

    if cur_conn.is_none() {
        tokio::fs::create_dir_all(local_data_dir().ok_or(Error::NoDataPath)?).await?;
        match tokio::fs::File::create_new(db_path().ok_or(Error::NoDataPath)?).await {
            Ok(_) => {}
            Err(err) => match err.kind() {
                ErrorKind::AlreadyExists => {}
                _ => Err(err)?,
            },
        }

        let conn = SqlitePool::connect(
            db_path()
                .as_ref()
                .and_then(|path| path.to_str())
                .ok_or(Error::NoDataPath)?,
        )
        .await?;

        sqlx::migrate!("./migrations/").run(&conn).await?;

        *cur_conn = Some(conn);
    }

    Ok(())
}
