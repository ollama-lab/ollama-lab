import type { Settings } from "$lib/models/settings"
import { invoke } from "@tauri-apps/api/core"

export async function getSettings(): Promise<Settings> {
  return await invoke<Settings>("get_settings")
}

export async function setSettings(newSettings: Settings): Promise<Settings> {
  return await invoke<Settings>("set_settings", { newSettings })
}

export async function defaultSettings(): Promise<Settings> {
  return await invoke<Settings>("default_settings")
}
