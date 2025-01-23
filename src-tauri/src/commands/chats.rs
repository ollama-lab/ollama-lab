use ollama_rest::chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct HistorialPrompt {
    pub id: i64,
    pub session_id: i64,
    pub role: String,
    pub content: String,
    pub date_created: DateTime<Utc>,
    pub date_edited: Option<DateTime<Utc>>,
    pub model: Option<String>,
}
