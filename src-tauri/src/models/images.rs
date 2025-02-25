use std::{fs::File, io::{BufReader, Cursor, Read}, path::Path};

use image::{imageops::FilterType, ImageFormat, ImageReader};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::{encoding::ToBase64, errors::Error, image::ToFormattedBytes, utils::images::resolve_stored_image_path};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Base64ImageReturn {
    pub path: String,
    pub mime: Option<String>,
    pub base64: String,
}

#[derive(Debug, FromRow)]
pub struct ImageEntry {
    pub id: i64,
    pub chat_id: i64,
    pub origin: Option<String>,
    pub path: String,
}

impl ImageEntry {
    pub fn into_image_return(self, resize_to: Option<(u32, u32)>) -> Result<ImageReturn, Error> {
        let file_path = resolve_stored_image_path(self.path.as_str()).ok_or(Error::NotExists)?;
        let image = ImageReader::open(&file_path)?;
        let image_format = image.format().unwrap_or(ImageFormat::Png);

        let mut decoded_image = image.decode()?;

        if let Some((w, h)) = resize_to {
            decoded_image = decoded_image.resize(w, h, FilterType::Lanczos3);
        }

        Ok(ImageReturn{
            id: self.id,
            origin: self.origin,
            base64: decoded_image.to_formatted_bytes(image_format)?.to_base64(),
            mime: image_format.to_mime_type(),
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageReturn {
    pub id: i64,
    pub origin: Option<String>,
    pub base64: String,
    pub mime: &'static str,
}
