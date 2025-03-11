use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::agent::Agent,
    utils::h2h::{
        get_selected_agents as get_selected_agents_,
        add_selected_agent as add_selected_agent_,
        remove_selected_agent as remove_selected_agent_,
    },
};

pub async fn get_selected_agents(
    state: State<'_, AppState>,
    session_id: i64,
) -> Result<Vec<Agent>, Error> {
    let pool = &state.conn_pool;

    Ok(get_selected_agents_(session_id, pool).await?)
}

pub async fn add_selected_agent(
    state: State<'_, AppState>,
    session_id: i64,
    agent_id: i64,
) -> Result<(), Error> {
    let pool = &state.conn_pool;

    add_selected_agent_(session_id, agent_id, pool).await?;
    Ok(())
}

pub async fn remove_selected_agent(
    state: State<'_, AppState>,
    session_id: i64,
    agent_id: i64,
) -> Result<(), Error> {
    let pool = &state.conn_pool;

    remove_selected_agent_(session_id, agent_id, pool).await?;
    Ok(())
}
