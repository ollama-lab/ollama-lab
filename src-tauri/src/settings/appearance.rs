use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct AppearanceSettings {
    pub color_mode: ColorMode,

    pub light: Option<String>,
    pub dark: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
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
