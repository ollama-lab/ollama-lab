use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
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

impl McpSource {
    pub async fn list_enabled<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        session_id: i64,
    ) -> Result<Vec<Self>, Error> {
        let ret = sqlx::query_as::<_, Self>(r#"
            SELECT m.id, m.label, m.source, m.transport_type, m.profile_id, m.data_created
            FROM mcp_sources m
            INNER JOIN session_enabled_mcp_sources sems
            ON m.id = sems.mcp_source_id
            WHERE sems.session_id = $1;
        "#)
        .bind(session_id)
        .fetch_all(executor)
        .await?;

        Ok(ret)
    }

    pub async fn list_enabled_id<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        session_id: i64,
    ) -> Result<Vec<i64>, Error> {
        let ret = sqlx::query_as::<_, (i64,)>(r#"
            SELECT mcp_source_id
            FROM session_enabled_mcp_sources
            WHERE session_id = $1;
        "#)
        .bind(session_id)
        .fetch_all(executor)
        .await?
        .into_iter()
        .map(|(session_id,)| session_id)
        .collect();

        Ok(ret)
    }

    pub async fn enable<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        mcp_source_id: i64,
        session_id: i64,
    ) -> Result<Option<i64>, Error> {
        let ret = sqlx::query_as::<_, (i64,)>(r#"
            INSERT INTO session_enabled_mcp_sources (session_id, mcp_source_id)
            VALUES ($1, $2)
            RETURNING mcp_source_id;
        "#)
        .bind(session_id)
        .bind(mcp_source_id)
        .fetch_optional(executor)
        .await?
        .map(|(id,)| id);

        Ok(ret)
    }

    pub async fn disable<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        mcp_source_id: i64,
        session_id: i64,
    ) -> Result<(), Error> {
        sqlx::query(r#"
            DELETE FROM session_enabled_mcp_sources
            WHERE session_id = $1, mcp_source_id = $2;
        "#)
        .bind(session_id)
        .bind(mcp_source_id)
        .execute(executor)
        .await?;

        Ok(())
    }
}

impl ListAll for McpSource {
    type Selector<'t> = i64;

    async fn list_all<'a>(
        executor: impl sqlx::Executor<'a, Database = sqlx::Sqlite>,
        profile_id: Self::Selector<'_>,
    ) -> Result<Vec<Self>, Error> {
        let ret = sqlx::query_as::<_, Self>(r#"
            SELECT id, label, source, transport_type, profile_id, date_created
            FROM mcp_sources
            WHERE profile_id = $1;
        "#)
        .bind(profile_id)
        .fetch_all(executor)
        .await?;

        Ok(ret)
    }
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
