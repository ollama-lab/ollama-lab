use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use transport_type::TransportType;

use crate::{errors::Error, utils::crud::Create};

pub mod transport_type;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct McpSource {
    pub id: i64,
    pub label: Option<String>,
    pub source: String,
    pub transport_type: String,
    pub session_id: i64,
    pub date_created: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct DefaultMcpSource {
    pub id: i64,
    pub label: Option<String>,
    pub source: String,
    pub transport_type: String,
    pub profile_id: i64,
}

pub struct DefaultMcpSourceCreation<'a, 'b> {
    pub label: Option<&'a str>,
    pub source: &'b str,
    pub transport_type: TransportType,
    pub profile_id: i64,
}

impl Create for DefaultMcpSource {
    type Create<'t> = DefaultMcpSourceCreation<'t, 't>;

    async fn create<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        create_info: &Self::Create<'_>,
    ) -> Result<Self, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                INSERT INTO default_mcp (label, source, transport_type, profile_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id, label, source, transport_type, profile_id;
            "#)
            .bind(create_info.label)
            .bind(create_info.source)
            .bind(create_info.transport_type.as_str())
            .bind(create_info.profile_id)
            .fetch_one(executor)
            .await?
        )
    }
}
