use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Base64ImageReturn {
    pub path: String,
    pub mime: Option<String>,
    pub base64: String,
}
