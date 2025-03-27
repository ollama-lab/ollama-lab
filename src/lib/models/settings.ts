export type ColorMode = "system" | "light" | "dark";

export interface AppearanceSettings {
  "color-mode": ColorMode;
  light: string | null;
  dark: string | null;
}

export interface OllamaSettings {
  uri: string | null;
}

export interface Settings {
  appearance: AppearanceSettings;
  ollama: OllamaSettings;
  h2h: boolean | null;
}
