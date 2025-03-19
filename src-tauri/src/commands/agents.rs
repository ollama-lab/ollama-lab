use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::agent::{Agent, AgentListItem, AgentSelector, AgentUpdate},
    utils::crud::OperateCrud,
};

pub mod selected;

#[tauri::command]
pub async fn get_session_agents(state: State<'_, AppState>, session_id: i64) -> Result<Vec<Agent>, Error> {
    let pool = &state.conn_pool;

    Ok(Agent::list_all(pool, AgentSelector::BySession(session_id)).await?)
}

#[tauri::command]
pub async fn get_session_agent(state: State<'_, AppState>, id: i64) -> Result<Option<Agent>, Error> {
    let pool = &state.conn_pool;

    Ok(Agent::get(pool, id, AgentSelector::ByProfile(state.profile)).await?)
}

#[tauri::command]
pub async fn add_session_agent(state: State<'_, AppState>, template_id: i64, session_id: i64) -> Result<Option<Agent>, Error> {
    let pool = &state.conn_pool;

    Ok(Agent::create_from_template(pool, template_id, session_id).await?)
}

#[tauri::command]
pub async fn update_session_agent(
    state: State<'_, AppState>,
    id: i64,
    update_info: AgentUpdate<'_>,
) -> Result<Option<Agent>, Error> {
    let pool = &state.conn_pool;

    Ok(Agent::update(pool, id, &update_info).await?)
}

#[tauri::command]
pub async fn delete_session_agent(state: State<'_, AppState>, id: i64) -> Result<Option<i64>, Error> {
    let pool = &state.conn_pool;

    Ok(Agent::delete(pool, id).await?)
}

#[tauri::command]
pub async fn list_all_agents(state: State<'_, AppState>, session_id: Option<i64>) -> Result<Vec<AgentListItem>, Error> {
    let pool = &state.conn_pool;

    Ok(AgentListItem::list_agents(
        pool,
        session_id
            .map(|session_id| AgentSelector::BySession(session_id))
            .unwrap_or_else(|| AgentSelector::ByProfile(state.profile)),
    )
    .await?)
}
