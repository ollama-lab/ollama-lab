use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use transport_type::TransportType;

use crate::{errors::Error, utils::crud::{Create, Delete, Update}};

pub mod transport_type;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct McpSource {
    pub id: i64,
    pub label: Option<String>,
    pub source: String,
    pub transport_type: String,
    pub profile_id: i64,
    pub date_created: DateTime<Utc>,
}

#[derive(Debug)]
pub struct McpSourceCreate<'a> {
    pub source: &'a str,
    pub transport_type: TransportType,
    pub profile_id: i64,
}

#[derive(Debug)]
pub struct McpSourceUpdate<'a, 'b> {
    pub label: Option<&'a str>,
    pub source: Option<&'b str>,
    pub transport_type: Option<TransportType>,
}

impl Create for McpSource {
    type Create<'t> = McpSourceCreate<'t>;

    async fn create<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        create_info: &Self::Create<'_>,
    ) -> Result<Self, Error> {
        let ret = sqlx::query_as::<_, Self>(r#"
            INSERT INTO mcp_sources (source, transport_type, profile_id)
            VALUES ($1, $2, $3)
            RETURNING id, label, source, transport_type, profild_id, date_created;
        "#)
        .bind(create_info.source)
        .bind(create_info.transport_type.as_str())
        .bind(create_info.profile_id)
        .fetch_one(executor)
        .await?;

        Ok(ret)
    }
}

impl Update for McpSource {
    type Id = i64;
    type Update<'t> = McpSourceUpdate<'t, 't>;

    async fn update<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        id: Self::Id,
        model: &Self::Update<'_>,
    ) -> Result<Option<Self>, Error> {
        let ret = sqlx::query_as::<_, Self>(r#"
            UPDATE mcp_sources
            SET label = NULLIF(IFNULL($2, label), ''),
                source = IFNULL($3, source),
                transport_type = IFNULL($4, transport_type)
            WHERE id = $1
            RETURNING id, label, source, transport_type, profild_id, date_created;
        "#)
        .bind(id)
        .bind(model.label)
        .bind(model.source)
        .bind(model.transport_type.as_ref().map(|item| item.as_str()))
        .fetch_optional(executor)
        .await?;

        Ok(ret)
    }
}

impl Delete for McpSource {
    type Id = i64;

    async fn delete<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        id: Self::Id,
    ) -> Result<Option<Self::Id>, Error> {
        let ret = sqlx::query_as::<_, (i64,)>(r#"
            DELETE FROM mcp_sources
            WHERE id = $1
            RETURNING id;
        "#)
        .bind(id)
        .fetch_optional(executor)
        .await?
        .map(|(id,)| id);

        Ok(ret)
    }

    async fn delete_model<'a>(
        self,
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
    ) -> Result<Option<Self::Id>, Error> {
        Self::delete(executor, self.id).await
    }
}
