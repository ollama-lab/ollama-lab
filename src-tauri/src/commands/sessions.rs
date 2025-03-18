use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    image::cleanup::remove_orphans,
    models::session::{Session, SessionCurrentModelReturn, SessionNameReturn},
    utils::sessions::get_session as get_session_,
};

#[tauri::command]
pub async fn list_sessions(state: State<'_, AppState>, mode: Option<String>) -> Result<Vec<Session>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let sessions = sqlx::query_as::<_, Session>(r#"
        SELECT id, profile_id, title, date_created, current_model, is_h2h
        FROM sessions
        WHERE profile_id = $1 AND mode = IFNULL($2, mode)
        ORDER BY date_created DESC;
    "#)
    .bind(profile_id)
    .bind(mode)
    .fetch_all(&mut *conn)
    .await?;

    Ok(sessions)
}

#[tauri::command]
pub async fn get_session(state: State<'_, AppState>, id: i64) -> Result<Option<Session>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    Ok(get_session_(&mut *conn, profile_id, id).await?)
}

#[tauri::command]
pub async fn rename_session(
    state: State<'_, AppState>,
    id: i64,
    new_name: Option<String>,
) -> Result<Option<SessionNameReturn>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let valid_new_name = new_name
        .as_ref()
        .map(|content| content.trim())
        .and_then(|trimmed| {
            if trimmed.is_empty() {
                None
            } else {
                Some(trimmed)
            }
        });

    let result = sqlx::query(
        "\
        UPDATE sessions
        SET title = $1
        WHERE id = $2 AND profile_id = $3;
    ",
    )
    .bind(valid_new_name)
    .bind(id)
    .bind(profile_id)
    .execute(&mut *conn)
    .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(SessionNameReturn {
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
    let mut conn = state.conn_pool.acquire().await?;

    let valid_model = model.trim();

    let result = sqlx::query(
        "\
        UPDATE sessions
        SET current_model = $1
        WHERE id = $2 AND profile_id = $3;
    ",
    )
    .bind(valid_model)
    .bind(id)
    .bind(profile_id)
    .execute(&mut *conn)
    .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(SessionCurrentModelReturn {
        id,
        current_model: valid_model.to_string(),
    }))
}

#[tauri::command]
pub async fn delete_session(state: State<'_, AppState>, id: i64) -> Result<Option<i64>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let result = sqlx::query(
        "\
        DELETE FROM sessions
        WHERE id = $1 AND profile_id = $2;
    ",
    )
    .bind(id)
    .bind(profile_id)
    .execute(&mut *conn)
    .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    remove_orphans(&mut conn).await?;

    Ok(Some(id))
}

#[tauri::command]
pub async fn create_session(
    state: State<'_, AppState>,
    current_model: String,
    title: Option<String>,
    is_h2h: bool,
) -> Result<Session, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let session = sqlx::query_as::<_, Session>(
        r#"
        INSERT INTO sessions (profile_id, current_model, title, is_h2h)
        VALUES ($1, $2, $3, $4)
        RETURNING id, profile_id, title, date_created, current_model, is_h2h;
    "#,
    )
    .bind(profile_id)
    .bind(current_model)
    .bind(title)
    .bind(is_h2h)
    .fetch_one(&mut *conn)
    .await?;

    Ok(session)
}
