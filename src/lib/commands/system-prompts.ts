import { invoke } from "@tauri-apps/api/core"

export async function getModelSystemPrompt(model: string): Promise<string | null> {
  return await invoke<string | null>("get_model_system_prompt", { model })
}

export async function setModelSystemPrompt(model: string, prompt: string | null): Promise<string | null> {
  return await invoke<string | null>("set_model_system_prompt", { model, prompt })
}
