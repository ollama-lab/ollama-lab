use tauri::State;

use crate::{app_state::AppState, errors::Error, utils::connections::ConvertMutexContentAsync};

#[tauri::command]
pub async fn get_model_system_prompt(state: State<'_, AppState>, model: String) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.convert_to().await?;

    Ok(
        sqlx::query_as::<_, (String,)>(r#"
            SELECT prompt
            FROM system_prompts
            WHERE profile_id = $1 AND model = $2;
        "#)
            .bind(profile_id).bind(model)
            .fetch_optional(&mut *conn)
            .await?
            .map(|tuple| tuple.0)
    )
}

#[tauri::command]
pub async fn set_model_system_prompt(
    state: State<'_, AppState>,
    model: String,
    prompt: Option<String>,
) -> Result<Option<String>, Error> {
    let profile_id = state.profile;
    let mut conn = state.conn_pool.convert_to().await?;

    let prompt = prompt
        .as_ref()
        .map(|s| s.trim())
        .and_then(|s| if s.is_empty() { None } else { Some(s) });

    Ok(
        sqlx::query_as::<_, (String,)>(r#"
            INSERT INTO system_prompts (profile_id, model, prompt)
            VALUES ($1, $2, $3)
            ON CONFLICT (profile_id, model)
            DO UPDATE SET prompt = excluded.prompt
            RETURNING prompt;
        "#)
            .bind(profile_id)
            .bind(model)
            .bind(prompt)
            .fetch_optional(&mut *conn)
            .await?
            .map(|tuple| tuple.0)
    )
}
