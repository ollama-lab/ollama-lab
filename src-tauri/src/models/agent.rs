use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{Executor, Sqlite};

use crate::errors::Error;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentTemplate {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
    pub date_created: DateTime<Utc>,
}

impl AgentTemplate {
    pub fn display_name(&self) -> &str {
        self.name.as_ref().map(|s| s.as_str()).unwrap_or_else(|| &self.model)
    }

    pub async fn create_agent(
        &self,
        session_id: i64,
        executor: impl Executor<'_, Database = Sqlite>,
    ) -> Result<Agent, Error> {
        Ok(sqlx::query_as::<_, Agent>(r#"
            INSERT INTO agents (name, model, system_prompt, session_id, template_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, model, system_prompt, session_id, template_id, date_created;
        "#)
            .bind(self.name.as_ref().map(|s| s.as_str()))
            .bind(&self.model)
            .bind(&self.system_prompt)
            .bind(session_id)
            .bind(self.id)
            .fetch_one(executor)
            .await?)
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Agent {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
    pub session_id: i64,
    pub template_id: Option<i64>,
    pub date_created: DateTime<Utc>,
}

impl Agent {
    pub fn display_name(&self) -> &str {
        self.name.as_ref().map(|s| s.as_str()).unwrap_or_else(|| &self.model)
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentCreation<'a> {
    pub model: &'a str,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentUpdate<'a> {
    pub name: Option<&'a str>,
    pub model: Option<&'a str>,
    pub system_prompt: Option<&'a str>,
}
