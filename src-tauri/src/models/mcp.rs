use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use transport_type::TransportType;

pub mod transport_type;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpSource {
    pub id: i64,
    pub label: String,
    pub source: String,
    pub transport_type: TransportType,
    pub session_id: i64,
    pub date_created: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DefaultMcpSource {
    pub id: i64,
    pub label: String,
    pub source: String,
    pub transport_type: TransportType,
    pub profile_id: i64,
}
