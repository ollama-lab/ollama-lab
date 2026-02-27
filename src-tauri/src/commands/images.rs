use std::path::Path;

use image::{imageops::FilterType, ImageFormat};
use serde::Deserialize;
use tauri::State;

use crate::{
    app_state::AppState, encoding::ToBase64, errors::Error,
    image::{get_compressed_image, ToFormattedBytes, MODEL_IMAGE_SIZE, THUMBNAIL_SIZE},
    models::images::{Base64ImageReturn, ImageReturn},
    utils::images::{get_chat_images, get_clipboard_image, is_clipboard_path, store_clipboard_image},
};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClipboardImagePayload {
    pub rgba: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

fn get_clipboard_thumbnail_base64(path: &str) -> Result<Base64ImageReturn, Error> {
    let cached = get_clipboard_image(path).ok_or(Error::NotExists)?;
    let image = cached
        .into_dynamic_image()?
        .resize(THUMBNAIL_SIZE.0, THUMBNAIL_SIZE.1, FilterType::Lanczos3);

    Ok(Base64ImageReturn{
        path: path.to_string(),
        mime: Some(ImageFormat::Png.to_mime_type().to_string()),
        base64: image.to_formatted_bytes(ImageFormat::Png)?.to_base64(),
    })
}

#[tauri::command]
pub async fn save_clipboard_image(payload: ClipboardImagePayload) -> Result<String, Error> {
    store_clipboard_image(payload.rgba, payload.width, payload.height)
}

#[tauri::command]
pub async fn get_compressed_image_base64(path: String) -> Result<Base64ImageReturn, Error> {
    let path = Path::new(path.as_str());
    let format = path
        .extension()
        .and_then(|oss| oss.to_str())
        .and_then(|s| ImageFormat::from_extension(s));

    Ok(Base64ImageReturn{
        path: path.to_str()
            .unwrap_or_else(|| "")
            .to_string(),
        mime: format.map(|s| s.to_mime_type().to_string()),
        base64: if let Some(format) = format {
            get_compressed_image(path, MODEL_IMAGE_SIZE)?
                .to_formatted_bytes(format)?
                .to_base64()
        } else { "".to_string() },
    })
}

#[tauri::command]
pub async fn get_thumbnail_base64(path: String) -> Result<Base64ImageReturn, Error> {
    if is_clipboard_path(path.as_str()) {
        return get_clipboard_thumbnail_base64(path.as_str());
    }

    let content = get_compressed_image(&path, THUMBNAIL_SIZE)?
        .to_formatted_bytes(ImageFormat::Png)?
        .to_base64();

    Ok(Base64ImageReturn{
        path,
        mime: Some(ImageFormat::Png.to_mime_type().to_string()),
        base64: content,
    })
}

#[tauri::command]
pub async fn get_images_by_chat_id(
    state: State<'_, AppState>,
    chat_id: i64,
) -> Result<Vec<ImageReturn>, Error> {
    let pool = &state.conn_pool;

    Ok(get_chat_images(pool, chat_id, Some(THUMBNAIL_SIZE)).await?)
}
