use ollama_rest::chrono::{DateTime, Utc};
use serde::Serialize;

pub mod mode;

#[derive(Debug, sqlx::FromRow, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    pub id: i64,
    pub profile_id: i64,
    pub title: Option<String>,
    pub date_created: DateTime<Utc>,
    pub current_model: String,
    pub mode: String,
}

#[derive(Debug, Serialize)]
pub struct SessionNameReturn {
    pub id: i64,
    pub title: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SessionCurrentModelReturn {
    pub id: i64,
    pub current_model: String,
}
