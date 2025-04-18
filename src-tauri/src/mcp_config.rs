use std::str::FromStr;

use rmcp::{service::RunningService, transport::{SseTransport, TokioChildProcess}, RoleClient, ServiceExt};
use serde::{Deserialize, Serialize};
use tokio::process::Command;

use crate::{errors::Error, models::mcp::transport_type::TransportType};

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

impl McpSource {
    pub async fn establish_client(&self) -> Result<RunningService<RoleClient, ()>, Error> {
        let client = match TransportType::from_str(&self.transport_type).unwrap() {
            TransportType::Stdio => {
                let args: Vec<&str> = self.source.split(' ').collect();

                ().serve(
                    TokioChildProcess::new(Command::new(args[0]).args(&args[1..]))?
                ).await?
            }
            TransportType::Sse => {
                ().serve(
                    SseTransport::start(&self.source).await?
                ).await?
            }
        };

        Ok(client)
    }
}
