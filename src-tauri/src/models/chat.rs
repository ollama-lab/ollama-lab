use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, sqlx::FromRow, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Chat {
    pub id: i64,
    pub session_id: i64,
    pub role: String,
    pub content: String,
    pub completed: bool,
    pub date_created: DateTime<Utc>,
    pub date_edited: Option<DateTime<Utc>>,
    pub model: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IncomingUserPrompt {
    pub text: String,
    pub image_path: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatGenerationReturn {
    pub id: i64,
    pub date_created: DateTime<Utc>,
}
