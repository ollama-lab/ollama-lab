use std::path::PathBuf;

use image::ImageFormat;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Base64ImageReturn {
    pub path: String,
    pub mime: Option<String>,
    pub base64: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum ImageReturn<'a> {
    #[serde(rename_all = "camelCase")]
    Reference {
        path: String,
        mime: &'a str,
    },

    #[serde(rename_all = "camelCase")]
    Embedded {
        original_path: Option<String>,
        blob: Vec<u8>,
        mime: &'a str,
    },
}

impl<'a> ImageReturn<'a> {
    pub fn new_optional(
        path: Option<&PathBuf>,
        blob: Option<Vec<u8>>,
        mime: Option<&'a str>,
    ) -> Option<Self> {
        let mime = mime.or_else(|| {
            path.as_ref().and_then(|p|
                p.extension()
                    .and_then(|oss| oss.to_str())
                    .and_then(|p|
                        ImageFormat::from_extension(p)
                            .map(|ext| ext.to_mime_type())
                    )
            )
        });

        let path_string_optional = path.and_then(|p| p.to_str().map(|s| s.to_string()));

        if let Some(mime) = mime {
            if let Some(blob) = blob {
                Some(Self::Embedded {
                    original_path: path_string_optional,
                    blob,
                    mime,
                })
            } else if let Some(path_string) = path_string_optional {
                Some(Self::Reference {
                    path: path_string,
                    mime,
                })
            } else {
                None
            }
        } else {
            None
        }
    }
}
