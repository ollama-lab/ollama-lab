use std::path::Path;

use image::ImageFormat;

use crate::{
    encoding::ToBase64,
    errors::Error,
    image::{get_compressed_image, ToFormattedBytes, MODEL_IMAGE_SIZE, THUMBNAIL_SIZE},
    models::images::Base64ImageReturn,
};

#[tauri::command]
pub fn get_compressed_image_base64(path: String) -> Result<Base64ImageReturn, Error> {
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
pub fn get_thumbnail_base64(path: String) -> Result<Base64ImageReturn, Error> {
    let content = get_compressed_image(&path, THUMBNAIL_SIZE)?
        .to_formatted_bytes(ImageFormat::Png)?
        .to_base64();

    Ok(Base64ImageReturn{
        path,
        mime: Some(ImageFormat::Png.to_mime_type().to_string()),
        base64: content,
    })
}
