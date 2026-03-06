use ollama_rest::models::chat::{ChatRequest, Message, Role};
use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    image::cleanup::remove_orphans,
    models::session::{Session, SessionCurrentModelReturn, SessionNameReturn, mode::SessionMode},
    settings::title_generation::DEFAULT_TITLE_GENERATION_SYSTEM_PROMPT,
    utils::sessions::get_session as get_session_,
};

fn normalize_title_candidate(raw: &str) -> Option<String> {
    let mut result = raw
        .replace(['\r', '\n'], " ")
        .trim()
        .trim_matches(|ch| matches!(ch, '"' | '\'' | '`'))
        .trim()
        .to_string();

    if result.is_empty() {
        return None;
    }

    let words = result.split_whitespace().collect::<Vec<&str>>();

    result = words.join(" ");

    if result.len() > 80 {
        result.truncate(80);
        result = result.trim().to_string();
    }

    if result.is_empty() {
        return None;
    }

    Some(result)
}

#[tauri::command]
pub async fn list_sessions(state: State<'_, AppState>, mode: SessionMode) -> Result<Vec<Session>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let sessions = sqlx::query_as::<_, Session>(
        r#"
        SELECT id, profile_id, title, date_created, current_model, mode
        FROM sessions
        WHERE profile_id = $1 AND mode = IFNULL($2, mode)
        ORDER BY date_created DESC;
    "#,
    )
    .bind(profile_id)
    .bind(mode.as_str())
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
        .and_then(|trimmed| if trimmed.is_empty() { None } else { Some(trimmed) });

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
    mode: SessionMode,
) -> Result<Session, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let session = sqlx::query_as::<_, Session>(
        r#"
        INSERT INTO sessions (profile_id, current_model, title, mode)
        VALUES ($1, $2, $3, $4)
        RETURNING id, profile_id, title, date_created, current_model, mode;
    "#,
    )
    .bind(profile_id)
    .bind(current_model)
    .bind(title)
    .bind(mode.as_str())
    .fetch_one(&mut *conn)
    .await?;

    Ok(session)
}

#[tauri::command]
pub async fn generate_session_title(
    state: State<'_, AppState>,
    session_id: i64,
    expected_current_title: String,
    first_prompt: String,
    first_response: String,
) -> Result<Option<SessionNameReturn>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.acquire().await?;

    let session = get_session_(&mut *conn, profile_id, session_id)
        .await?
        .ok_or(Error::NotExists)?;

    if session.mode != SessionMode::Normal.as_str() {
        return Ok(None);
    }

    let current_title = session.title.clone().unwrap_or_default();
    if current_title.trim() != expected_current_title.trim() {
        return Ok(None);
    }

    let settings = state.settings.lock().await.clone();
    if !settings.title_generation.enabled {
        return Ok(None);
    }

    let model = settings
        .title_generation
        .model
        .as_ref()
        .map(|value| value.trim())
        .filter(|value| !value.is_empty())
        .unwrap_or(session.current_model.as_str())
        .to_string();

    let system_prompt = settings
        .title_generation
        .system_prompt
        .as_ref()
        .map(|value| value.trim())
        .filter(|value| !value.is_empty())
        .unwrap_or(DEFAULT_TITLE_GENERATION_SYSTEM_PROMPT)
        .to_string();

    let user_prompt = format!(
        "Create a short title for this conversation.\n\nUser prompt:\n{}\n\nAssistant response:\n{}",
        first_prompt.trim(),
        first_response.trim(),
    );

    let req = ChatRequest {
        model,
        stream: Some(false),
        format: None,
        tools: None,
        keep_alive: None,
        options: None,
        think: None,
        messages: vec![
            Message {
                role: Role::System,
                content: system_prompt,
                images: None,
                tool_calls: None,
                thinking: None,
            },
            Message {
                role: Role::User,
                content: user_prompt,
                images: None,
                tool_calls: None,
                thinking: None,
            },
        ],
    };

    let response = state
        .ollama
        .chat::<fn(&ollama_rest::models::chat::ChatResponse)>(&req, None)
        .await?;
    let generated = response
        .message
        .as_ref()
        .and_then(|message| normalize_title_candidate(message.content.as_str()));
    let Some(title) = generated else {
        return Ok(None);
    };

    let result = sqlx::query(
        r#"
        UPDATE sessions
        SET title = $1
        WHERE id = $2 AND profile_id = $3 AND mode = $4 AND TRIM(IFNULL(title, '')) = TRIM($5);
    "#,
    )
    .bind(title.as_str())
    .bind(session.id)
    .bind(profile_id)
    .bind(SessionMode::Normal.as_str())
    .bind(expected_current_title)
    .execute(&mut *conn)
    .await?;

    if result.rows_affected() < 1 {
        return Ok(None);
    }

    Ok(Some(SessionNameReturn {
        id: session.id,
        title: Some(title),
    }))
}
