use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Agent {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
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
