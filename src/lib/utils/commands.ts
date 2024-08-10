import type { Model } from "$lib/models/models"
import { invoke } from "@tauri-apps/api/core"

export function listModels() {
  return invoke<Model[]>("list_models")
}
