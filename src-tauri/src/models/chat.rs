use std::{collections::HashMap, future::Future};

use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{Executor, Sqlite};

use crate::errors::Error;

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
    pub parent_id: Option<i64>,
    pub thoughts: Option<String>,
    pub thought_for: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatWithVersions {
    pub id: i64,
    pub session_id: i64,
    pub role: String,
    pub content: String,
    pub completed: bool,
    pub date_created: DateTime<Utc>,
    pub date_edited: Option<DateTime<Utc>>,
    pub model: Option<String>,
    pub parent_id: Option<i64>,
    pub thoughts: Option<String>,
    pub thought_for: Option<i64>,
    pub versions: Option<Vec<i64>>,
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

pub trait IntoVecWithVersions<'c> {
    type Output;
    type Err;

    fn into_with_versions(self, executor: impl Executor<'c, Database = Sqlite>) -> impl Future<Output = Result<Self::Output, Self::Err>>;
}

impl<'c> IntoVecWithVersions<'c> for Chat {
    type Output = ChatWithVersions;
    type Err = Error;

    async fn into_with_versions(self, executor: impl Executor<'c, Database = Sqlite>) -> Result<ChatWithVersions, Error> {
        let versions: Vec<i64> = sqlx::query_as::<_, (i64,)>(r#"
            SELECT id
            FROM chats
            WHERE
                parent_id IS (SELECT parent_id FROM chats WHERE id = $1)
                AND session_id = $2;
        "#)
            .bind(self.id)
            .bind(self.session_id)
            .fetch_all(executor)
            .await?
            .into_iter()
            .map(|tuple| tuple.0)
            .collect();

        Ok(ChatWithVersions{
            id: self.id,
            session_id: self.session_id,
            role: self.role,
            content: self.content,
            completed: self.completed,
            date_created: self.date_created,
            date_edited: self.date_edited,
            model: self.model,
            parent_id: self.parent_id,
            thoughts: self.thoughts,
            thought_for: self.thought_for,
            versions: Some(versions),
        })
    }
}

impl<'c> IntoVecWithVersions<'c> for Vec<Chat> {
    type Output = Vec<ChatWithVersions>;
    type Err = Error;

    async fn into_with_versions(self, executor: impl Executor<'c, Database = Sqlite>) -> Result<Self::Output, Self::Err> {
        if self.is_empty() {
            return Ok(Vec::new());
        }

        let mut version_map = HashMap::<Option<i64>, Vec<i64>>::new();

        let belong_pairs = sqlx::query_as::<_, (Option<i64>, i64)>(r#"
            SELECT parent_id, id
            FROM chats
            WHERE
                session_id = $1;
        "#)
            .bind(self.first().unwrap().session_id)
            .fetch_all(executor)
            .await?;

        for (parent, id) in belong_pairs.into_iter() {
            if let Some(id_list) = version_map.get_mut(&parent) {
                id_list.push(id);
            } else {
                _ = version_map.insert(parent, vec![id]);
            }
        }

        Ok(
            self.into_iter()
                .map(|item| ChatWithVersions{
                    id: item.id,
                    session_id: item.session_id,
                    role: item.role,
                    content: item.content,
                    completed: item.completed,
                    date_created: item.date_created,
                    date_edited: item.date_edited,
                    model: item.model,
                    parent_id: item.parent_id,
                    thoughts: item.thoughts,
                    thought_for: item.thought_for,
                    versions: version_map.remove(&item.parent_id),
                })
                .collect()
        )
    }
}
