use serde::{Deserialize, Serialize};

pub const DEFAULT_TITLE_GENERATION_SYSTEM_PROMPT: &str =
    "Generate a concise 2-5 word title for this conversation. Return only the title text.";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct TitleGenerationSettings {
    pub enabled: bool,
    pub model: Option<String>,
    pub system_prompt: Option<String>,
}

impl Default for TitleGenerationSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            model: None,
            system_prompt: None,
        }
    }
}
