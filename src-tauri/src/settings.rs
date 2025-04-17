use appearance::AppearanceSettings;
use ollama::OllamaSettings;
use serde::{Deserialize, Serialize};

pub mod appearance;
pub mod error;
pub mod ollama;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Settings {
    pub appearance: AppearanceSettings,
    pub ollama: OllamaSettings,
    pub h2h: Option<bool>,
}
