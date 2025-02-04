use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct AppearanceSettings {
    pub color_mode: ColorMode,

    pub light: Option<String>,
    pub dark: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ColorMode {
    System,
    Light,
    Dark,
}

impl Default for ColorMode {
    fn default() -> Self {
        Self::System
    }
}
