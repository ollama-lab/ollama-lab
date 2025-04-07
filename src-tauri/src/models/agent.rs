use ollama_rest::chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{pool::PoolConnection, Acquire, Executor, Sqlite};

use crate::{
    errors::Error,
    utils::{
        crud::{Create, Delete, Get, InplaceSave, ListAll, ListPaginated, Update}, length_index::ToLengthIndex, vec_move::MoveElement
    },
};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentListItem {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
}

impl AgentListItem {
    pub async fn list_all_templates(
        executor: impl Executor<'_, Database = Sqlite>,
        profile_id: i64,
    ) -> Result<Vec<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                SELECT id, name, model
                FROM agent_templates
                WHERE profile_id = $1;
            "#)
            .bind(profile_id)
            .fetch_all(executor)
            .await?
        )
    }

    pub async fn list_agents(
        executor: impl Executor<'_, Database = Sqlite>,
        selector: AgentSelector,
    ) -> Result<Vec<Self>, Error> {
        let ret = match selector {
            AgentSelector::BySession(session_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT id, name, model
                    FROM agents
                    WHERE session_id = $1
                    ORDER BY "order" DESC, id;
                "#)
                .bind(session_id)
            }

            AgentSelector::ByProfile(profile_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT a.id, a.name, a.model
                    FROM agents a
                    INNER JOIN sessions s ON a.session_id = s.id
                    WHERE s.profile_id = $1
                    ORDER BY a."order" DESC, a.id;
                "#)
                .bind(profile_id)
            }
        }.fetch_all(executor).await?;

        Ok(ret)
    }

    pub async fn reorder_agent_list<'a>(
        conn: &mut PoolConnection<Sqlite>,
        list: &'a Vec<Self>,
        session_id: i64,
        src_index: i64,
        dest_index: i64,
    ) -> Result<Vec<&'a Self>, Error> {
        let len = list.len();

        let src_index = src_index.into_length_index(len) as usize;
        let dest_index = dest_index.into_length_index(len) as usize;

        let mut new_orders: Vec<&Self> = list.iter().collect();
        new_orders.move_element(src_index, dest_index);

        let mut order_num = 0;
        let mut order_uplevel = 0;
        let mut prev_id: Option<i64> = None;

        let mut order_result: Vec<(i64, i64)> = Vec::with_capacity(new_orders.len());

        let mut order_iter = new_orders.iter();
        while let Some(&&Self{ id, .. }) = order_iter.next() {
            if let Some(prev_id) = prev_id {
                if prev_id > id {
                    order_num -= 1;
                    order_uplevel += 1;
                }
            }

            order_result.push((id, order_num));
            prev_id = Some(id);
        }

        order_result.iter_mut().for_each(|(_, order)| *order += order_uplevel);

        let mut tx = conn.begin().await?;

        for (id, order) in order_result {
            sqlx::query(r#"
                UPDATE agents
                SET "order" = $1
                WHERE id = $2, session_id = $3;
            "#)
            .bind(order).bind(id).bind(session_id)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(new_orders)
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentTemplate {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
    pub date_created: DateTime<Utc>,
}

impl AgentTemplate {
    pub fn display_name(&self) -> &str {
        self.name.as_ref().map(|s| s.as_str()).unwrap_or_else(|| &self.model)
    }

    #[inline]
    pub async fn to_agent(
        &self,
        executor: impl Executor<'_, Database = Sqlite>,
        session_id: i64,
    ) -> Result<Option<Agent>, Error> {
        Agent::create_from_template(executor, self.id, session_id).await
    }
}

pub struct AgentTemplateCreation<'a> {
    pub model: &'a str,
    pub profile_id: i64,
}

pub struct AgentTemplateUpdate<'a> {
    pub name: Option<&'a str>,
    pub model: Option<&'a str>,
    pub system_prompt: Option<&'a str>,
}

impl Create for AgentTemplate {
    type Create = AgentTemplateCreation<'_>;

    async fn create(
        executor: impl Executor<'_, Database = Sqlite>, 
        create_info: &Self::Create,
    ) -> Result<Self, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                INSERT INTO agent_templates (model, profile_id)
                VALUES ($1, $2)
                RETURNING id, name, model, system_prompt, date_created;
            "#)
            .bind(&create_info.model)
            .bind(create_info.profile_id)
            .fetch_one(executor)
            .await?
        )
    }

}

impl Get for AgentTemplate {
    type Id = i64;
    type Selector = i64;

    async fn get(
        executor: impl Executor<'_, Database = Sqlite>,
        id: Self::Id,
        profile_id: i64,
    ) -> Result<Option<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                SELECT id, name, model, system_prompt, date_created
                FROM agent_templates
                WHERE id = $1 AND profile_id = $2;
            "#)
            .bind(id)
            .bind(profile_id)
            .fetch_optional(executor)
            .await?
        )
    }

}

impl ListAll for AgentTemplate {
    type Selector = i64;

    async fn list_all(
        executor: impl Executor<'_, Database = Sqlite>,
        profile_id: i64,
    ) -> Result<Vec<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                SELECT id, name, model, system_prompt, date_created
                FROM agent_templates
                WHERE profile_id = $1;
            "#)
            .bind(profile_id)
            .fetch_all(executor)
            .await?
        )
    }
}

impl ListPaginated for AgentTemplate {
    type Selector = i64;

    async fn list_paged<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        page_index: u32,
        size: u32,
        profile_id: i64,
    ) -> Result<Vec<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                SELECT id, name, model, system_prompt, date_created
                FROM agent_templates
                WHERE profile_id = $1
                LIMIT $2
                OFFSET $3;
            "#)
            .bind(profile_id)
            .bind(size)
            .bind(page_index * size)
            .fetch_all(executor)
            .await?
        )
    }
}

impl InplaceSave for AgentTemplate {
    async fn save<'a>(
        &mut self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> Result<(), Error> {
        let (name, model, system_prompt, date_created) = sqlx::query_as::<_, (Option<String>, String, Option<String>, DateTime<Utc>)>(r#"
            INSERT INTO agent_templates (id, name, model, system_prompt)
            VALUES ($1, NULLIF($2, ''), $3, NULLIF($4, ''))
            ON CONFLICT (id) DO UPDATE SET
                name = excluded.name,
                model = IFNULL(NULLIF(excluded.model, ''), model),
                system_prompt = excluded.system_prompt
            WHERE id = excluded.id
            RETURNING name, model, system_prompt, date_created;
        "#)
        .bind(self.id)
        .bind(self.name.as_ref().map(|s| s.trim()))
        .bind(self.model.trim())
        .bind(self.system_prompt.as_ref().map(|s| s.trim()))
        .fetch_one(executor)
        .await?;

        self.name = name;
        self.model = model;
        self.system_prompt = system_prompt;
        self.date_created = date_created;

        Ok(())
    }
}

impl Update for AgentTemplate {
    type Id = i64;
    type Update = AgentTemplateUpdate<'t>;

    async fn update<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        model: &Self::Update,
    ) -> Result<Option<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                UPDATE agent_templates
                SET name = NULLIF(IFNULL($2, name), ''),
                    model = IFNULL(NULLIF($3, ''), model),
                    system_prompt = NULLIF(IFNULL($4, system_prompt), '')
                WHERE id = $1
                RETURNING id, name, model, system_prompt, date_created;
            "#)
            .bind(id)
            .bind(model.name.as_ref().map(|s| s.trim()))
            .bind(model.model.as_ref().map(|s| s.trim()))
            .bind(model.system_prompt.as_ref().map(|s| s.trim()))
            .fetch_optional(executor)
            .await?
        )
    }
}

impl Delete for AgentTemplate {
    type Id = i64;

    async fn delete_model<'a>(
        self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> Result<Option<Self::Id>, Error> {
        Ok(
            sqlx::query_as::<_, (i64,)>(r#"
                DELETE FROM agent_templates
                WHERE id = $1
                RETURNING id;
            "#)
            .bind(self.id)
            .fetch_optional(executor)
            .await?
            .map(|(id,)| id)
        )
    }

    async fn delete<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: i64,
    ) -> Result<Option<Self::Id>, Error> {
        Ok(
            sqlx::query_as::<_, (i64,)>(r#"
                DELETE FROM agent_templates
                WHERE id = $1
                RETURNING id;
            "#)
            .bind(id)
            .fetch_optional(executor)
            .await?
            .map(|(id,)| id)
        )
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Agent {
    pub id: i64,
    pub name: Option<String>,
    pub model: String,
    pub system_prompt: Option<String>,
    pub session_id: i64,
    pub template_id: Option<i64>,
    pub order: i64,
    pub date_created: DateTime<Utc>,
}

impl Agent {
    pub fn display_name(&self) -> &str {
        self.name.as_ref().map(|s| s.as_str()).unwrap_or_else(|| &self.model)
    }

    pub async fn create_from_template(
        executor: impl Executor<'_, Database = Sqlite>,
        template_id: i64,
        session_id: i64,
    ) -> Result<Option<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                INSERT INTO agents (name, model, system_prompt, session_id, template_id)
                SELECT name, model, system_prompt, $2, id
                FROM agent_templates
                WHERE id = $1
                RETURNING id, name, model, system_prompt, session_id, template_id, "order", date_created;
            "#)
            .bind(template_id)
            .bind(session_id)
            .fetch_optional(executor)
            .await?
        )
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentCreation<'a> {
    pub model: &'a str,
    pub session_id: i64,
    pub template_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AgentUpdate<'a> {
    pub name: Option<&'a str>,
    pub model: Option<&'a str>,
    pub system_prompt: Option<&'a str>,
    pub session_id: Option<i64>,
    pub template_id: Option<(Option<i64>,)>,
    pub order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case", tag = "type", content = "id")]
pub enum AgentSelector {
    BySession(i64),
    ByProfile(i64),
}

impl Create for Agent {
    type Create = AgentCreation<'_>;

    async fn create<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        create_info: &Self::Create,
    ) -> Result<Self, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                INSERT INTO agents (model, session_id, template_id)
                SELECT $1, $2, $3
                RETURNING id, name, model, system_prompt, session_id, template_id, date_created;
            "#)
            .bind(create_info.model)
            .bind(create_info.session_id)
            .bind(create_info.template_id)
            .fetch_one(executor)
            .await?
        )
    }
}

impl Get for Agent {
    type Id = i64;
    type Selector = AgentSelector;

    async fn get<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        selector: Self::Selector,
    ) -> Result<Option<Self>, Error> {
        let ret = match selector {
            AgentSelector::BySession(session_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT id, name, model, system_prompt, session_id, template_id, "order", date_created
                    FROM agents
                    WHERE id = $1 AND session_id = $2;
                "#)
                .bind(id)
                .bind(session_id)
            }
            AgentSelector::ByProfile(profile_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT a.id, a.name, a.model, a.system_prompt, a.session_id, a.template_id, a."order", a.date_created
                    FROM agents a
                    INNER JOIN sessions s ON a.session_id = s.id
                    WHERE a.id = $1 AND s.profile_id = $2;
                "#)
                .bind(id)
                .bind(profile_id)
            }
        }.fetch_optional(executor).await?;

        Ok(ret)
    }
}

impl ListAll for Agent {
    type Selector = AgentSelector;

    async fn list_all<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        selector: Self::Selector,
    ) -> Result<Vec<Self>, Error> {
        let ret = match selector {
            AgentSelector::BySession(session_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT id, name, model, system_prompt, session_id, template_id, "order", date_created
                    FROM agents
                    WHERE session_id = $1
                    ORDER BY "order" DESC, id;
                "#)
                .bind(session_id)
            }

            AgentSelector::ByProfile(profile_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT a.id, a.name, a.model, a.system_prompt, a.session_id, a.template_id, a."order", a.date_created
                    FROM agents a
                    INNER JOIN sessions s ON a.session_id = s.id
                    WHERE s.profile_id = $1
                    ORDER BY a."order" DESC, a.id;
                "#)
                .bind(profile_id)
            }
        }.fetch_all(executor).await?;

        Ok(ret)
    }
}

impl ListPaginated for Agent {
    type Selector = AgentSelector;

    async fn list_paged<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        page_index: u32,
        size: u32,
        selector: Self::Selector,
    ) -> Result<Vec<Self>, Error> {
        let ret = match selector {
            AgentSelector::BySession(session_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT id, name, model, system_prompt, session_id, template_id, "order", date_created
                    FROM agents
                    WHERE session_id = $1
                    ORDER BY "order" DESC, id
                    LIMIT $3
                    OFFSET $4;
                "#)
                .bind(session_id)
            }

            AgentSelector::ByProfile(profile_id) => {
                sqlx::query_as::<_, Self>(r#"
                    SELECT a.id, a.name, a.model, a.system_prompt, a.session_id, a.template_id, a."order", a.date_created
                    FROM agents a
                    INNER JOIN sessions s ON a.session_id = s.id
                    WHERE s.profile_id = $1
                    ORDER BY a."order" DESC, a.id
                    LIMIT $3
                    OFFSET $4;
                "#)
                .bind(profile_id)
            }
        }
        .bind(size)
        .bind(page_index * size)
        .fetch_all(executor)
        .await?;

        Ok(ret)
    }
}

impl InplaceSave for Agent {
    async fn save<'a>(
        &mut self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> Result<(), Error> {
        let (name, model, system_prompt, session_id, template_id, order, date_created) = sqlx::query_as::<_, (
            Option<String>, String, Option<String>, i64, Option<i64>, i64, DateTime<Utc>,
        )>(r#"
            INSERT INTO agents (id, name, model, system_prompt, session_id, template_id, "order")
            VALUES ($1, NULLIF($2, ''), $3, NULLIF($4, ''), $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                name = excluded.name,
                model = IFNULL(excluded.model, model)
                system_prompt = excluded.system_prompt,
                session_id = excluded.session_id,
                template_id = excluded.template_id,
                "order" = excluded."order"
            WHERE id = excluded.id
            RETURNING name, model, system_prompt, session_id, template_id, "order", date_created;
        "#)
        .bind(self.name.as_ref().map(|s| s.trim()))
        .bind(self.model.trim())
        .bind(self.system_prompt.as_ref().map(|s| s.trim()))
        .bind(self.session_id)
        .bind(self.template_id)
        .bind(self.order)
        .fetch_one(executor)
        .await?;

        self.name = name;
        self.model = model;
        self.system_prompt = system_prompt;
        self.session_id = session_id;
        self.template_id = template_id;
        self.order = order;
        self.date_created = date_created;

        Ok(())
    }
}

impl Update for Agent {
    type Id = i64;
    type Update = AgentUpdate<'t>;

    async fn update<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
        model: &Self::Update,
    ) -> Result<Option<Self>, Error> {
        Ok(
            sqlx::query_as::<_, Self>(r#"
                UPDATE agents
                SET name = NULLIF(IFNULL($2, name), ''),
                    model = IFNULL(NULLIF($3, ''), model),
                    system_prompt = NULLIF(IFNULL($4, system_prompt), ''),
                    session_id = IFNULL($5, session_id),
                    template_id = IIF($7, template_id, $6),
                    "order" = IFNULL($8, "order")
                WHERE id = $1
                RETURNING *;
            "#)
            .bind(id)
            .bind(model.name)
            .bind(model.model)
            .bind(model.system_prompt)
            .bind(model.session_id)
            .bind(model.template_id.and_then(|(inner,)| inner))
            .bind(model.template_id.is_none())
            .bind(model.order)
            .fetch_optional(executor)
            .await?
        )
    }
}

impl Delete for Agent {
    type Id = i64;

    async fn delete_model<'a>(
        self,
        executor: impl Executor<'a, Database = Sqlite>,
    ) -> Result<Option<Self::Id>, Error> {
        Ok(
            sqlx::query_as::<_, (i64,)>(r#"
                DELETE FROM agents
                WHERE id = $1
                RETURNING id;
            "#)
            .bind(self.id)
            .fetch_optional(executor)
            .await?
            .map(|(id,)| id)
        )
    }

    async fn delete<'a>(
        executor: impl Executor<'a, Database = Sqlite>,
        id: Self::Id,
    ) -> Result<Option<Self::Id>, Error> {
        Ok(
            sqlx::query_as::<_, (i64,)>(r#"
                DELETE FROM agents
                WHERE id = $1
                RETURNING id;
            "#)
            .bind(id)
            .fetch_optional(executor)
            .await?
            .map(|(id,)| id)
        )
    }
}
