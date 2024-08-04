use ollama_lab_db_desktop::{load_connection, model::session::Session};

use crate::{db::DB_URL, error::Error};

#[tauri::command]
pub async fn list_sessions() -> Result<Vec<Session>, Error> {
    let mut conn = load_connection(DB_URL.get().ok_or_else(|| Error::NoDataPath)?).await?;

    Ok(Session::from_default_owner(&mut conn).await?)
}

#[tauri::command]
pub async fn remove_session(session_id: i32) -> Result<(), Error> {
    let mut conn = load_connection(DB_URL.get().ok_or_else(|| Error::NoDataPath)?).await?;

    Session::delete_by_id(&mut conn, session_id).await?;
    Ok(())
}
