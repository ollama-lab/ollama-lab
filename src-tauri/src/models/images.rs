use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Base64ImageReturn<'a, 'b, 'c> {
    path: &'a str,
    format: &'b str,
    base64: &'c str,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OwnedBase64ImageReturn {
    path: String,
    format: String,
    base64: String,
}
