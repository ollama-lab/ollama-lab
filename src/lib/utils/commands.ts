import type { Model, ModelInfo, RunningModel } from "$lib/models/models"
import { invoke } from "@tauri-apps/api/core"

export function listModels() {
  return invoke<Model[]>("list_models")
}

export function listRunningModels() {
  return invoke<RunningModel[]>("list_running_models")
}

export function getModelInfo(name: string) {
  return invoke<ModelInfo>("model_info", { name })
}
