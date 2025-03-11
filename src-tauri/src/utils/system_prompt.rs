use sqlx::{Executor, Sqlite};

use crate::errors::Error;

pub async fn get_system_prompt(
    profile: i64,
    model: &str,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Option<String>, Error> {
    Ok(sqlx::query_as::<_, (String,)>(
        r#"
            SELECT prompt
            FROM system_prompts
            WHERE profile_id = $1 AND model = $2;
        "#,
    )
    .bind(profile)
    .bind(model)
    .fetch_optional(executor)
    .await?
    .map(|tuple| tuple.0))
}

pub async fn set_system_prompt(
    profile: i64,
    model: &str,
    executor: impl Executor<'_, Database = Sqlite>,
    content: Option<&str>,
) -> Result<Option<String>, Error> {
    let prompt = content
        .map(|s| s.trim())
        .and_then(|s| if s.is_empty() { None } else { Some(s) });

    Ok(if let Some(prompt) = prompt {
        sqlx::query_as::<_, (String,)>(
            r#"
                INSERT INTO system_prompts (profile_id, model, prompt)
                VALUES ($1, $2, $3)
                ON CONFLICT (profile_id, model) DO UPDATE SET prompt = excluded.prompt
                RETURNING prompt;
            "#,
        )
        .bind(profile)
        .bind(model)
        .bind(prompt)
        .fetch_optional(executor)
        .await?
        .map(|tuple| tuple.0)
    } else {
        sqlx::query(
            r#"
                DELETE FROM system_prompts
                WHERE profile_id = $1 AND model = $2;
            "#,
        )
        .bind(profile)
        .bind(model)
        .execute(executor)
        .await?;

        None
    })
}

pub async fn get_session_system_prompt(
    session_id: i64,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Option<String>, Error> {
    Ok(sqlx::query_as::<_, (String,)>(r#"
        SELECT content
        FROM session_system_prompts
        WHERE session_id = $1;
    "#)
        .bind(session_id)
        .fetch_optional(executor)
        .await?
        .map(|tuple| tuple.0))
}

pub async fn set_session_system_prompt(
    session_id: i64,
    content: Option<&str>,
    executor: impl Executor<'_, Database = Sqlite>,
) -> Result<Option<String>, Error> {
    let mut ret: Option<String> = None;

    if let Some(content) = content
            .map(|value| value.trim())
            .and_then(|value| if value.is_empty() { None } else { Some(value) }) {
        ret = sqlx::query_as::<_, (String,)>(r#"
            INSERT INTO session_system_prompts (session_id, content)
            VALUE ($1, $2)
            ON CONFLICT (session_id)
            DO UPDATE SET content = excluded.content;
        "#)
            .bind(session_id)
            .bind(content)
            .fetch_optional(executor)
            .await?
            .map(|tuple| tuple.0);
    } else {
        sqlx::query(r#"
            DELETE FROM session_system_prompts
            WHERE session_id = $1;
        "#)
            .bind(session_id)
            .execute(executor)
            .await?;
    }

    Ok(ret)
}

