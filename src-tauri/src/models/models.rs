use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum Tag {
    #[serde(rename_all = "camelCase")]
    Category {
        content: String,
    },
    #[serde(rename_all = "camelCase")]
    Parameter {
        content: String,
    },
}

impl Tag {
    pub fn infer_by_class_name(class_name: &str, content: String) -> Self {
        if class_name.contains("indigo") {
            Self::Category { content }
        } else {
            Self::Parameter { content }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchItem {
    pub name: String,
    pub description: Option<String>,
    pub tags: Vec<Tag>,
    pub pulls: String,
    pub tag_count: String,
    pub updated: String,
}
