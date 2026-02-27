use std::fs::create_dir_all;
use std::path::PathBuf;
use std::sync::LazyLock;
use std::time::Duration;

use image::{imageops::FilterType, DynamicImage, RgbaImage};
use moka::sync::Cache;
use sqlx::{Executor, Sqlite};
use uuid::{ContextV7, Timestamp, Uuid};

use crate::image::{get_compressed_image, MODEL_IMAGE_SIZE};
use crate::models::images::{ImageEntry, ImageReturn};
use crate::errors::Error;
use crate::paths::local_data_dir;

pub const CLIPBOARD_IMAGE_PREFIX: &str = "clipboard:";

#[derive(Clone)]
pub struct ClipboardImage {
    pub rgba: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

impl ClipboardImage {
    pub fn into_dynamic_image(self) -> Result<DynamicImage, Error> {
        RgbaImage::from_raw(self.width, self.height, self.rgba)
            .map(|image| DynamicImage::ImageRgba8(image))
            .ok_or_else(|| Error::Message("Invalid clipboard image data".to_string()))
    }
}

static CLIPBOARD_IMAGE_CACHE: LazyLock<Cache<String, ClipboardImage>> = LazyLock::new(|| {
    Cache::builder()
        .max_capacity(128)
        .time_to_idle(Duration::from_secs(60 * 10))
        .build()
});

pub fn is_clipboard_path(path: &str) -> bool {
    path.starts_with(CLIPBOARD_IMAGE_PREFIX)
}

pub fn store_clipboard_image(rgba: Vec<u8>, width: u32, height: u32) -> Result<String, Error> {
    let expected_length = width
        .checked_mul(height)
        .and_then(|value| value.checked_mul(4))
        .ok_or_else(|| Error::Message("Clipboard image is too large".to_string()))?;

    if rgba.len() != expected_length as usize {
        return Err(Error::Message("Clipboard image data is invalid".to_string()));
    }

    let id = Uuid::new_v7(Timestamp::now(ContextV7::new())).to_string();
    CLIPBOARD_IMAGE_CACHE.insert(
        id.clone(),
        ClipboardImage {
            rgba,
            width,
            height,
        },
    );

    Ok(format!("{CLIPBOARD_IMAGE_PREFIX}{id}"))
}

pub fn get_clipboard_image(path: &str) -> Option<ClipboardImage> {
    let id = path.strip_prefix(CLIPBOARD_IMAGE_PREFIX)?;
    CLIPBOARD_IMAGE_CACHE.get(id).map(|value| value.to_owned())
}

fn save_clipboard_image(path: &str) -> Result<String, Error> {
    let cached = get_clipboard_image(path).ok_or(Error::NotExists)?;
    let image = cached
        .into_dynamic_image()?
        .resize(MODEL_IMAGE_SIZE.0, MODEL_IMAGE_SIZE.1, FilterType::Lanczos3);

    let file_uuid = Uuid::new_v7(Timestamp::now(ContextV7::new()));
    let mut dest_file_path = PathBuf::from(file_uuid.to_string());
    dest_file_path.set_extension("png");

    let dest_file_name = dest_file_path
        .file_name()
        .and_then(|f| f.to_str())
        .ok_or(Error::NotExists)?;
    let dest = resolve_stored_image_path(dest_file_name).ok_or(Error::NotExists)?;
    if let Some(parent_dir) = dest.parent() {
        create_dir_all(parent_dir)?;
    }

    image.save(&dest)?;
    if let Some(id) = path.strip_prefix(CLIPBOARD_IMAGE_PREFIX) {
        CLIPBOARD_IMAGE_CACHE.invalidate(id);
    }

    Ok(dest_file_name.to_string())
}

pub async fn get_chat_image(
    executor: impl Executor<'_, Database = Sqlite>,
    image_id: i64,
    resize_to: Option<(u32, u32)>,
) -> Result<Option<ImageReturn>, Error> {
    Ok(
        match sqlx::query_as::<_, ImageEntry>(r#"
            SELECT id, chat_id, origin, path
            FROM prompt_images
            WHERE id = $1;
        "#)
            .bind(image_id)
            .fetch_optional(executor)
            .await?
        {
            Some(entry) => Some(entry.into_image_return(resize_to)?),
            None => None,
        }
    )
}

pub async fn get_chat_images(
    executor: impl Executor<'_, Database = Sqlite>,
    chat_id: i64,
    resize_to: Option<(u32, u32)>,
) -> Result<Vec<ImageReturn>, Error> {
    let entries = sqlx::query_as::<_, ImageEntry>(r#"
        SELECT id, chat_id, origin, path 
        FROM prompt_images 
        WHERE chat_id = $1;
    "#)
        .bind(chat_id)
        .fetch_all(executor)
        .await?;

    let mut ret = Vec::with_capacity(entries.len());

    for entry in entries {
        ret.push(entry.into_image_return(resize_to)?);
    }

    Ok(ret)
}

pub fn get_image_cache_path() -> Option<PathBuf> {
    let mut data_dir = local_data_dir()?;
    data_dir.push("images");

    Some(data_dir)
}

pub fn resolve_stored_image_path(path: &str) -> Option<PathBuf> {
    let path = PathBuf::from(path);
    let trimmed_path = path.file_name()?;

    let mut data_dir = get_image_cache_path()?;
    data_dir.push(trimmed_path);
    Some(data_dir)
}

pub fn save_image(origin: &str, reuse_local: bool) -> Result<String, Error> {
    if is_clipboard_path(origin) {
        return save_clipboard_image(origin);
    }

    if reuse_local {
        if let Some(mut assumed_path) = get_image_cache_path() {
            if let Some(origin_file_name) = PathBuf::from(origin).file_name() {
                assumed_path.push(origin_file_name);
                if assumed_path.try_exists().unwrap_or(false) {
                    if let Some(file_name) = assumed_path.file_name() {
                        if let Some(file_name) = file_name.to_str() {
                            return Ok(file_name.to_string());
                        }
                    }
                }
            }
        }
    }

    let path = PathBuf::from(origin);

    let file_uuid = Uuid::new_v7(Timestamp::now(ContextV7::new()));
    let mut dest_file_path = PathBuf::from(file_uuid.to_string());
    if let Some(ext) = path.extension() {
        dest_file_path.set_extension(ext);
    }

    let image = get_compressed_image(origin, MODEL_IMAGE_SIZE)?;
    let dest_file_name = dest_file_path.file_name().and_then(|f| f.to_str()).ok_or(Error::NotExists)?;
    let dest = resolve_stored_image_path(dest_file_name).ok_or(Error::NotExists)?;
    if let Some(parent_dir) = dest.parent() {
        create_dir_all(parent_dir)?;
    }

    image.save(&dest)?;
    
    Ok(dest_file_name.to_string())
}
