use sqlx::{Executor, Sqlite};

use crate::{errors::Error, models::session::Session};

pub async fn get_session(
    executor: impl Executor<'_, Database = Sqlite>,
    profile_id: i64,
    session_id: i64,
) -> Result<Option<Session>, Error> {
    Ok(sqlx::query_as::<_, Session>(
        "\
        SELECT id, profile_id, title, date_created, current_model, is_h2h
        FROM sessions
        WHERE profile_id = $1 AND id = $2
        ORDER BY date_created DESC;
    ",
    )
    .bind(profile_id)
    .bind(session_id)
    .fetch_optional(executor)
    .await?)
}
