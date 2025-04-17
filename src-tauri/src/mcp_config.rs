use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct McpSource {
    pub label: Option<String>,
    pub source: String,
    pub transport_type: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct McpConfig {
    pub sources: Option<Vec<McpSource>>,
}
