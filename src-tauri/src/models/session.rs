use ollama_rest::chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct Session {
    pub id: i64,
    pub profile_id: i64,
    pub title: Option<String>,
    pub date_created: DateTime<Utc>,
    pub current_model: String,
}
