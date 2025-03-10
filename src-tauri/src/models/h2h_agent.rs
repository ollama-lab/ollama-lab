use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct H2hAgent {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
    pub date_created: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct H2hAgentCreation<'a> {
    pub model: &'a str,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct H2hAgentUpdate<'a> {
    pub name: Option<&'a str>,
    pub model: Option<&'a str>,
    pub system_prompt: Option<&'a str>,
}
