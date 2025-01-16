import { invoke } from "@tauri-apps/api/core"
import { defaultModel } from "$lib/stores/models"

export async function initialize(): Promise<void> {
  await invoke("initialize")

  // Misc
  defaultModel.set(await invoke("get_default_model"))
}
