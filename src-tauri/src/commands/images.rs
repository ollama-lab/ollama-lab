use std::path::Path;

use base64::prelude::*;
use tokio::{fs::File, io::AsyncReadExt};

use crate::{errors::Error, models::images::Base64ImageReturn};

#[tauri::command]
pub async fn read_image_base64(path: String) -> Result<Base64ImageReturn, Error> {
    let mut buffer = Vec::new();

    let path = Path::new(path.as_str());
    File::open(&path)
        .await?
        .read_to_end(&mut buffer)
        .await?;

    Ok(Base64ImageReturn{
        base64: BASE64_STANDARD.encode(buffer.as_slice()),
        path: path.to_str().unwrap_or("").to_string(),
        format: path.extension()
            .and_then(|p| p.to_str())
            .map(|s| s.to_string()),
    })
}
