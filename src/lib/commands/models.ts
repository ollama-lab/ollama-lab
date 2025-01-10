import type { ModelListItem } from "$lib/models/model-item"
import { invoke } from "@tauri-apps/api/core"

export async function listLocalModels(): Promise<ModelListItem[]> {
  return invoke<ModelListItem[]>("list_local_models")
}
