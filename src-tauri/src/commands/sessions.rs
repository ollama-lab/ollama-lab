use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::session::{Session, SessionCurrentModelReturn, SessionNameReturn},
};

#[tauri::command]
pub async fn list_sessions(state: State<'_, AppState>) -> Result<Vec<Session>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let sessions = sqlx::query_as::<_, Session>(
        "\
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE profile_id = $1
        ORDER BY date_created DESC;
    ",
    )
    .bind(profile_id)
    .fetch_all(&mut *conn)
    .await?;

    Ok(sessions)
}

#[tauri::command]
pub async fn get_session(state: State<'_, AppState>, id: i64) -> Result<Option<Session>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let session = sqlx::query_as::<_, Session>(
        "\
        SELECT id, profile_id, title, date_created, current_model
        FROM sessions
        WHERE profile_id = $1 AND id = $2
        ORDER BY date_created DESC;
    ",
    )
    .bind(profile_id)
    .bind(id)
    .fetch_optional(&mut *conn)
    .await?;

    Ok(session)
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

    Ok(Some(id))
}

#[tauri::command]
pub async fn create_session(
    state: State<'_, AppState>,
    current_model: String,
    title: Option<String>,
) -> Result<Session, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let session = sqlx::query_as::<_, Session>(
        r#"
        INSERT INTO sessions (profile_id, current_model, title)
        VALUES ($1, $2, $3)
        RETURNING id, profile_id, title, date_created, current_model;
    "#,
    )
    .bind(profile_id)
    .bind(current_model)
    .bind(title)
    .fetch_one(&mut *conn)
    .await?;

    Ok(session)
}
