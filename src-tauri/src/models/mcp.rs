use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, Executor};
use transport_type::TransportType;

use crate::{errors::Error, utils::crud::{Create, Delete, ListAll, Update}};

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

#[derive(Debug)]
pub struct DefaultMcpSourceCreation<'a, 'b> {
    pub label: Option<&'a str>,
    pub source: &'b str,
    pub transport_type: TransportType,
    pub profile_id: i64,
}

#[derive(Debug)]
pub struct DefaultMcpSourceUpdate<'a, 'b> {
    pub label: Option<&'a str>,
    pub source: Option<&'b str>,
    pub transport_type: Option<TransportType>,
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

impl ListAll for DefaultMcpSource {
    type Selector<'t> = i64;

    async fn list_all<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        profile_id: Self::Selector<'_>,
    ) -> Result<Vec<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                SELECT id, label, source, transport_type, profile_id
                FROM default_mcp
                WHERE profile_id = $1
            "#)
            .bind(profile_id)
            .fetch_all(executor)
            .await?
        )
    }
}

impl Update for DefaultMcpSource {
    type Id = i64;
    type Update<'t> = DefaultMcpSourceUpdate<'t, 't>;

    async fn update<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        id: Self::Id,
        model: &Self::Update<'_>,
    ) -> Result<Option<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                UPDATE default_mcp
                SET label = NULLIF(IFNULL($2, label), ''),
                    source = IFNULL($3, source),
                    transport_type = IFNULL($4, transport_type),
                WHERE id = $1
                RETURNING id, label, source, transport_type, profile_id;
            "#)
            .bind(id)
            .bind(model.label)
            .bind(model.source)
            .bind(model.transport_type.as_ref().map(|t| t.as_str()))
            .fetch_optional(executor)
            .await?
        )
    }
}

impl Delete for DefaultMcpSource {
    type Id = i64;

    async fn delete<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        id: Self::Id,
    ) -> Result<Option<Self::Id>, Error> {
        Ok(
            sqlx::query_as::<_, (i64,)>(r#"
                DELETE FROM default_mcp
                WHERE id = $1
                RETURNING id;
            "#)
            .bind(id)
            .fetch_optional(executor)
            .await?
            .map(|(id,)| id)
        )
    }

    async fn delete_model<'a>(
        self,
        executor: impl Executor<'a, Database = sqlx::Sqlite>,
    ) -> Result<Option<Self::Id>, Error> {
        Self::delete(executor, self.id).await
    }
}
