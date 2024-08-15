use ollama_lab_db_desktop::model::session::Session;

use crate::{db::get_connection, error::Error};

#[tauri::command]
pub async fn list_sessions() -> Result<Vec<Session>, Error> {
    let mut conn = get_connection().await?;

    Ok(Session::from_default_owner(&mut conn).await?)
}

#[tauri::command]
pub async fn remove_session(session_id: i32) -> Result<(), Error> {
    let mut conn = get_connection().await?;

    Session::delete_by_id(&mut conn, session_id).await?;
    Ok(())
}
