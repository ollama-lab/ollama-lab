use std::{io::Cursor, path::Path};

use image::{imageops::FilterType, DynamicImage, ImageFormat, ImageReader};
use sqlx::{Executor, Sqlite};

use crate::errors::Error;

pub mod cleanup;

pub const MODEL_IMAGE_SIZE: (u32, u32) = (1024, 1024);
pub const THUMBNAIL_SIZE: (u32, u32) = (200, 200);

pub fn get_compressed_image(
    path: impl AsRef<Path>,
    max_size: (u32, u32),
) -> Result<DynamicImage, Error> {
    Ok(ImageReader::open(path)?
        .decode()?
        .resize(max_size.0, max_size.1, FilterType::Lanczos3))
}

pub trait ToFormattedBytes {
    fn to_formatted_bytes(&self, format: ImageFormat) -> Result<Vec<u8>, Error>;
}

impl ToFormattedBytes for DynamicImage {
    fn to_formatted_bytes(&self, format: ImageFormat) -> Result<Vec<u8>, Error> {
        let mut bytes = Vec::new();

        self.write_to(&mut Cursor::new(&mut bytes), format)?;

        Ok(bytes)
    }
}

pub async fn get_image_paths_of_last_sibling<'a>(
    executor: impl Executor<'a, Database = Sqlite>,
    parent_id: Option<i64>,
) -> Result<Vec<String>, Error> {
    Ok(sqlx::query_as::<_, (String,)>(r#"
        SELECT path
        FROM prompt_images
        WHERE chat_id IN (
            SELECT id FROM chats
            WHERE parent_id IS $1
            ORDER BY date_created DESC, id DESC
            LIMIT 1
        );
    "#)
        .bind(parent_id)
        .fetch_all(executor)
        .await?
        .into_iter()
        .map(|tuple| tuple.0)
        .collect())
}
