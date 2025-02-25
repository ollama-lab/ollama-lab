use std::{collections::HashMap, future::Future};

use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{pool::PoolConnection, Sqlite};

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
pub struct MountedChat {
    pub id: i64,
    pub session_id: i64,
    pub role: String,
    pub content: String,
    pub image_count: u32,
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
    pub image_paths: Option<Vec<String>>,
    pub use_system_prompt: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatGenerationReturn {
    pub id: i64,
    pub date_created: DateTime<Utc>,
}

pub trait MountChatInfo<'c> {
    type Output;
    type Err;

    fn mount_info(
        self,
        conn: &mut PoolConnection<Sqlite>,
    ) -> impl Future<Output = Result<Self::Output, Self::Err>>;
}

impl<'c> MountChatInfo<'c> for Chat {
    type Output = MountedChat;
    type Err = Error;

    async fn mount_info(
        self,
        conn: &mut PoolConnection<Sqlite>,
    ) -> Result<MountedChat, Error> {
        let versions: Vec<i64> = sqlx::query_as::<_, (i64,)>(
            r#"
            SELECT id
            FROM chats
            WHERE
                parent_id IS (SELECT parent_id FROM chats WHERE id = $1)
                AND session_id = $2;
        "#,
        )
        .bind(self.id)
        .bind(self.session_id)
        .fetch_all(&mut **conn)
        .await?
        .into_iter()
        .map(|tuple| tuple.0)
        .collect();

        let image_count = sqlx::query_as::<_, (u32,)>(r#"
            SELECT COUNT(*)
            FROM prompt_images
            WHERE chat_id = $1
        "#)
            .bind(self.id)
            .fetch_one(&mut **conn)
            .await?
            .0;

        Ok(MountedChat {
            id: self.id,
            session_id: self.session_id,
            role: self.role,
            content: self.content,
            image_count,
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

impl<'c> MountChatInfo<'c> for Vec<Chat> {
    type Output = Vec<MountedChat>;
    type Err = Error;

    async fn mount_info(
        self,
        conn: &mut PoolConnection<Sqlite>,
    ) -> Result<Self::Output, Self::Err> {
        if self.is_empty() {
            return Ok(Vec::new());
        }

        let mut version_map = HashMap::<Option<i64>, Vec<i64>>::new();

        let belong_pairs = sqlx::query_as::<_, (Option<i64>, i64)>(
            r#"
            SELECT parent_id, id
            FROM chats
            WHERE
                session_id = $1;
        "#,
        )
        .bind(self.first().unwrap().session_id)
        .fetch_all(&mut **conn)
        .await?;

        for (parent, id) in belong_pairs.into_iter() {
            if let Some(id_list) = version_map.get_mut(&parent) {
                id_list.push(id);
            } else {
                _ = version_map.insert(parent, vec![id]);
            }
        }

        let mut image_count_map = HashMap::new();

        for chat in self.iter() {
            let image_count = sqlx::query_as::<_, (u32,)>(r#"
                SELECT COUNT(*) 
                FROM prompt_image_paths
                WHERE chat_id = $1;
            "#)
                .bind(chat.id)
                .fetch_one(&mut **conn)
                .await?
                .0;

            image_count_map.insert(chat.id, image_count);
        }

        Ok(self
            .into_iter()
            .map(|item| MountedChat {
                id: item.id,
                session_id: item.session_id,
                role: item.role,
                content: item.content,
                image_count: image_count_map.remove(&item.id).unwrap_or(0),
                completed: item.completed,
                date_created: item.date_created,
                date_edited: item.date_edited,
                model: item.model,
                parent_id: item.parent_id,
                thoughts: item.thoughts,
                thought_for: item.thought_for,
                versions: version_map.remove(&item.parent_id),
            })
            .collect())
    }
}
