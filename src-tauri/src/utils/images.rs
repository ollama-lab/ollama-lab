use sqlx::pool::PoolConnection;
use sqlx::Sqlite;

use crate::models::images::{ImageEntry, ImageReturn};
use crate::errors::Error;

pub async fn get_chat_image(
    conn: &mut PoolConnection<Sqlite>,
    image_id: i64,
    resize_to: Option<(u32, u32)>,
) -> Result<Option<ImageReturn>, Error> {
    Ok(
        match sqlx::query_as::<_, ImageEntry>(r#"
            SELECT id, chat_id, path, blob, mime
            FROM prompt_images 
            WHERE id = $1;
        "#)
            .bind(image_id)
            .fetch_optional(&mut **conn)
            .await?
        {
            Some(entry) => Some(entry.into_image_return(resize_to)?),
            None => None,
        }
    )
}

pub async fn get_chat_images(
    conn: &mut PoolConnection<Sqlite>,
    chat_id: i64,
    resize_to: Option<(u32, u32)>,
) -> Result<Vec<ImageReturn>, Error> {
    let entries = sqlx::query_as::<_, ImageEntry>(r#"
        SELECT id, chat_id, path, blob, mime
        FROM prompt_images 
        WHERE chat_id = $1;
    "#)
        .bind(chat_id)
        .fetch_all(&mut **conn)
        .await?;

    let mut ret = Vec::with_capacity(entries.len());

    for entry in entries {
        ret.push(entry.into_image_return(resize_to)?);
    }

    Ok(ret)
}
