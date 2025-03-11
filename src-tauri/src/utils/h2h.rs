use sqlx::{Executor, Sqlite};

use crate::{errors::Error, models::agent::{Agent, AgentCreation, AgentUpdate}};

pub async fn get_agent(
    agent_id: i64,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Option<Agent>, Error> {
    Ok(sqlx::query_as::<_, Agent>(r#"
        SELECT id, name, model, system_prompt, date_created
        FROM agents
        WHERE id = $1;
    "#)
        .bind(agent_id)
        .fetch_optional(executor)
        .await?)
}

pub async fn list_agents(executor: impl Executor<'_, Database = Sqlite>) -> Result<Vec<Agent>, Error> {
    Ok(sqlx::query_as::<_, Agent>(r#"
        SELECT id, name, model, system_prompt, date_created
        FROM agents;
    "#).fetch_all(executor).await?)
}

pub async fn create_agent(
    create_info: &AgentCreation<'_>,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Agent, Error> {
    Ok(sqlx::query_as::<_, Agent>(r#"
        INSERT INTO agents (model)
        VALUES ($1)
        RETURNING id, name, model, system_prompt, date_created;
    "#)
        .bind(create_info.model)
        .fetch_one(executor)
        .await?)
}

pub async fn update_agent(
    id: i64,
    update_info: &AgentUpdate<'_>,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Option<Agent>, Error> {
    Ok(sqlx::query_as::<_, Agent>(r#"
        UPDATE agents
        SET name = NULLIF(COALESCE($2, name)),
            model = COALESCE($3, model),
            system_prompt = NULLIF(COALESCE($4, system_prompt), '')
        WHERE id = $1
        RETURNING id, name, model, system_prompt, date_created;
    "#)
        .bind(id)
        .bind(update_info.name.map(|name| name.trim()))
        .bind(update_info.model
            .map(|model| model.trim())
            .and_then(|trimmed| if trimmed.is_empty() { None } else { Some(trimmed) }))
        .bind(update_info.system_prompt.map(|value| value.trim()))
        .fetch_optional(executor)
        .await?)
}

pub async fn delete_agent(id: i64, executor: impl Executor<'_, Database = Sqlite>) -> Result<Option<i64>, Error> {
    Ok(sqlx::query_as::<_, (i64,)>(r#"
        DELETE FROM agents
        WHERE id = $1
        RETURNING id;
    "#)
        .bind(id)
        .fetch_optional(executor)
        .await?
        .map(|tuple| tuple.0))
}
