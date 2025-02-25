use tauri::State;

use crate::{
    app_state::AppState,
    errors::Error,
    models::chat::{MountedChat, MountChatInfo},
    responses::tree::ChatTree,
    utils::connections::ConvertMutexContentAsync,
};

#[tauri::command]
pub async fn get_current_branch(
    state: State<'_, AppState>,
    session_id: i64,
) -> Result<Vec<MountedChat>, Error> {
    let mut conn = state.conn_pool.convert_to().await?;
    let profile_id = state.profile;

    let session = sqlx::query_as::<_, (i64,)>(
        r#"
        SELECT id FROM sessions WHERE profile_id = $1 AND id = $2;
    "#,
    )
    .bind(profile_id)
    .bind(session_id)
    .fetch_optional(&mut *conn)
    .await?
    .ok_or(Error::NotExists)?;

    ChatTree::new(session.0)
        .current_branch(&mut *conn, None, false)
        .await?
        .mount_info(&mut *conn)
        .await
}

#[tauri::command]
pub async fn switch_branch(
    state: State<'_, AppState>,
    target_chat_id: i64,
) -> Result<(Option<i64>, Vec<MountedChat>), Error> {
    let mut conn = state.conn_pool.convert_to().await?;
    let profile_id = state.profile;

    let chat_info = sqlx::query_as::<_, (i64, i64, Option<i64>)>(
        r#"
        SELECT c.id, s.id, c.parent_id
        FROM sessions s
        INNER JOIN chats c ON s.id = c.session_id
        WHERE s.profile_id = $1 AND c.id = $2;
    "#,
    )
    .bind(profile_id)
    .bind(target_chat_id)
    .fetch_optional(&mut *conn)
    .await?
    .ok_or(Error::NotExists)?;

    let tree = ChatTree::new(chat_info.1);

    tree.set_default(&mut *conn, chat_info.0).await?;
    Ok((
        chat_info.2,
        tree.current_branch(&mut *conn, chat_info.2, false)
            .await?
            .mount_info(&mut *conn)
            .await?,
    ))
}
