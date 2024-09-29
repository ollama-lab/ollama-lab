import type { Bubble } from "$lib/models/feed"
import type { Model, ModelInfo, RunningModel } from "$lib/models/models"
import type { Session } from "$lib/models/sessions"
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

export function listSessions() {
  return invoke<Session[]>("list_sessions")
}

export function getChatHistory(sessionId: number) {
  return invoke<Bubble[]>("list_chat_bubbles", { sessionId })
}
