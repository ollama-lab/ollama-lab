use std::io::Cursor;

use image::{imageops::FilterType, ImageBuffer, ImageFormat, ImageReader};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::{encoding::ToBase64, errors::Error};

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
    pub image: Vec<u8>,
}

impl ImageEntry {
    pub fn into_image_return(self, resize_to: Option<(u32, u32)>) -> Result<ImageReturn, Error> {
        let image = ImageReader::new(Cursor::new(self.image)).with_guessed_format()?;
        let mime = image.format().unwrap_or(ImageFormat::Png).to_mime_type();

        let decoded_image = image.decode()?;

        let base64 = if let Some(resize_to) = resize_to {
            decoded_image.resize(resize_to.0, resize_to.1, FilterType::Lanczos3)
        } else {
            decoded_image
        }.into_bytes().to_base64();

        Ok(ImageReturn{
            id: self.id,
            origin: self.origin,
            base64,
            mime,
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
