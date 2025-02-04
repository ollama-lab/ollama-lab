export interface AppearanceSettings {
  "color-mode": "system" | "light" | "dark"
  light: string | null
  dark: string | null
}

export interface OllamaSettings {
  uri: string | null
}

export interface Settings {
  appearance: AppearanceSettings
  ollama: OllamaSettings
}
