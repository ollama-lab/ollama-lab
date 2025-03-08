use sqlx::{pool::PoolConnection, Sqlite};
use tokio::fs::{read_dir, remove_file};

use crate::{errors::Error, utils::images::get_image_cache_path};

/// Remove image files that are not referenced
/// in any sessions.
///
/// Since 0.3.0
pub async fn remove_orphans(conn: &mut PoolConnection<Sqlite>) -> Result<(), Error> {
    let existing_image_entires = sqlx::query_as::<_, (String,)>(r#"
        SELECT path FROM prompt_images;
    "#)
        .fetch_all(&mut **conn)
        .await?
        .into_iter()
        .map(|tuple| tuple.0)
        .collect::<Vec<String>>();

    let root_option = get_image_cache_path();
    if let Some(root) = root_option {
        if root.is_dir() {
            let mut dir = read_dir(root).await?;

            while let Some(child) = dir.next_entry().await? {
                if child.file_type().await?.is_dir() {
                    continue;
                }
                
                if let Some(file_name) = child.file_name().to_str() {
                    if !existing_image_entires.contains(&file_name.to_string()) {
                        remove_file(child.path()).await?;
                    }
                }
            }
        }
    }

    Ok(())
}
