import { z } from "zod";

export const colorModeSchema = z.enum(["system", "light", "dark"]);

export type ColorModeSchema = typeof colorModeSchema;
export type ColorMode = z.infer<ColorModeSchema>;

export const appearanceSettingsSchema = z.object({
  "color-mode": colorModeSchema,
  light: z.string().nullable(),
  dark: z.string().nullable(),
  zoom: z.number().positive().nullable(),
});

export type AppearanceSettingsSchema = typeof appearanceSettingsSchema;
export type AppearanceSettings = z.infer<AppearanceSettingsSchema>;

export const ollamaSettingsSchema = z.object({
  uri: z.string().nullable(),
});

export type OllamaSettingsSchema = typeof ollamaSettingsSchema;
export type OllamaSettings = z.infer<OllamaSettingsSchema>;

export const titleGenerationSettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.string().nullable(),
  "system-prompt": z.string().nullable(),
});

export type TitleGenerationSettingsSchema = typeof titleGenerationSettingsSchema;
export type TitleGenerationSettings = z.infer<TitleGenerationSettingsSchema>;

export const settingsSchema = z.object({
  appearance: appearanceSettingsSchema,
  ollama: ollamaSettingsSchema,
  "title-generation": titleGenerationSettingsSchema,
  h2h: z.boolean().nullable(),
});

export type SettingsSchema = typeof settingsSchema;
export type Settings = z.infer<SettingsSchema>;
