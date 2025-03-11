use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::agent::{Agent, AgentCreation, AgentUpdate},
    utils::h2h::{
        create_agent,
        get_agent as get_agent_,
        list_agents,
        update_agent as update_agent_,
        delete_agent as delete_agent_,
    },
};

pub mod selected;

#[tauri::command]
pub async fn get_all_agents(state: State<'_, AppState>) -> Result<Vec<Agent>, Error> {
    let pool = state.conn_pool.clone();

    Ok(list_agents(state.profile, &pool).await?)
}

#[tauri::command]
pub async fn get_agent(state: State<'_, AppState>, id: i64) -> Result<Option<Agent>, Error> {
    let pool = state.conn_pool.clone();

    Ok(get_agent_(state.profile, id, &pool).await?)
}

#[tauri::command]
pub async fn add_agent(state: State<'_, AppState>, model: String) -> Result<Agent, Error> {
    let pool = state.conn_pool.clone();

    Ok(create_agent(state.profile, &AgentCreation{ model: model.as_str() }, &pool).await?)
}

#[tauri::command]
pub async fn update_agent(
    state: State<'_, AppState>,
    id: i64,
    update_info: AgentUpdate<'_>,
) -> Result<Option<Agent>, Error> {
    let pool = state.conn_pool.clone();

    Ok(update_agent_(state.profile, id, &update_info, &pool).await?)
}

#[tauri::command]
pub async fn delete_agent(state: State<'_, AppState>, id: i64) -> Result<Option<i64>, Error> {
    let pool = state.conn_pool.clone();

    Ok(delete_agent_(state.profile, id, &pool).await?)
}
