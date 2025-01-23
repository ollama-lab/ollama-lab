use tauri::State;

use crate::{app_state::AppState, errors::Error, models::session::{Session, SessionCurrentModelReturn, SessionNameReturn}};

#[tauri::command]
pub async fn list_sessions(state: State<'_, AppState>) -> Result<Vec<Session>, Error> {
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let sessions = sqlx::query_as::<_, Session>("\
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE profile_id = $1
        ORDER BY date_created DESC;
    ")
        .bind(profile_id)
        .fetch_all(conn)
        .await?;

    Ok(sessions)
}

#[tauri::command]
pub async fn rename_session(
    state: State<'_, AppState>,
    id: i64,
    new_name: Option<String>,
) -> Result<Option<SessionNameReturn>, Error> {
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;
    
    let valid_new_name = new_name
        .as_ref()
        .map(|content| content.trim())
        .and_then(|trimmed| if trimmed.is_empty() { None } else { Some(trimmed) });

    let result = sqlx::query("\
        UPDATE sessions
        SET title = $1
        WHERE id = $2 AND profile_id = $3;
    ")
        .bind(valid_new_name).bind(id).bind(profile_id)
        .execute(conn)
        .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(SessionNameReturn{
        id,
        title: valid_new_name.map(|content| content.to_string()),
    }))
}

#[tauri::command]
pub async fn set_session_model(
    state: State<'_, AppState>,
    id: i64,
    model: String,
) -> Result<Option<SessionCurrentModelReturn>, Error> {
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let valid_model = model.trim();

    let result = sqlx::query("\
        UPDATE sessions
        SET current_model = $1
        WHERE id = $2 AND profile_id = $3;
    ")
        .bind(valid_model).bind(id).bind(profile_id)
        .execute(conn)
        .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(SessionCurrentModelReturn{
        id,
        current_model: valid_model.to_string(),
    }))
}

#[tauri::command]
pub async fn delete_session(state: State<'_, AppState>, id: i64) -> Result<Option<i64>, Error> {
    let profile_id = state.profile;
    let conn_op = state.conn.lock().await;
    let conn = conn_op.as_ref().ok_or(Error::NoConnection)?;

    let result = sqlx::query("\
        DELETE FROM sessions
        WHERE id = $1 AND profile_id = $2;
    ")
        .bind(id).bind(profile_id)
        .execute(conn)
        .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(id))
}
