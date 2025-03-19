use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::agent::{AgentListItem, AgentSelector},
};

#[tauri::command]
pub async fn list_all_agent_templates(state: State<'_, AppState>) -> Result<Vec<AgentListItem>, Error> {
    let pool = &state.conn_pool;

    Ok(AgentListItem::list_all_templates(pool, state.profile).await?)
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
