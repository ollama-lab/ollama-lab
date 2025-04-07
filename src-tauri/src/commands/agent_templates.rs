use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::agent::{AgentListItem, AgentTemplate, AgentTemplateCreation, AgentTemplateUpdate},
    utils::crud::{Get, Create, Update, Delete},
};

#[tauri::command]
pub async fn list_all_agent_templates(state: State<'_, AppState>) -> Result<Vec<AgentListItem>, Error> {
    let pool = &state.conn_pool;

    Ok(AgentListItem::list_all_templates(pool, state.profile).await?)
}

#[tauri::command]
pub async fn get_agent_template(state: State<'_, AppState>, id: i64) -> Result<Option<AgentTemplate>, Error> {
    let pool = &state.conn_pool;

    Ok(AgentTemplate::get(pool, id, state.profile).await?)
}

#[tauri::command]
pub async fn add_agent_template(
    state: State<'_, AppState>,
    model: String,
) -> Result<AgentTemplate, Error> {
    let pool = &state.conn_pool;

    Ok(AgentTemplate::create(pool, &AgentTemplateCreation{ model: &model, profile_id: state.profile }).await?)
}

#[tauri::command]
pub async fn update_agent_template(
    state: State<'_, AppState>,
    id: i64,
    name: Option<String>,
    model: Option<String>,
    system_prompt: Option<String>,
) -> Result<Option<AgentTemplate>, Error> {
    let pool = &state.conn_pool;

    let name = name.as_ref().map(|s| s.as_str());
    let model = model.as_ref().map(|s| s.as_str());
    let system_prompt = system_prompt.as_ref().map(|s| s.as_str());

    Ok(AgentTemplate::update( pool, id, &AgentTemplateUpdate{ name, model, system_prompt }).await?)
}

#[tauri::command]
pub async fn delete_agent_template(state: State<'_, AppState>, id: i64) -> Result<Option<i64>, Error> {
    let pool = &state.conn_pool;

    Ok(AgentTemplate::delete(pool, id).await?)
}
