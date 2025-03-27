import { invoke } from "@tauri-apps/api/core";

export async function getModelSystemPrompt(model: string): Promise<string | null> {
  return await invoke<string | null>("get_model_system_prompt", { model });
}

export async function setModelSystemPrompt(model: string, prompt: string | null): Promise<string | null> {
  return await invoke<string | null>("set_model_system_prompt", { model, prompt });
}

export async function getSessionSystemPrompt(sessionId: number): Promise<string | null> {
  return await invoke<string | null>("get_session_system_prompt", { sessionId });
}

export async function setSessionSystemPrompt(sessionId: number, value: string | null): Promise<string | null> {
  return await invoke<string | null>("set_session_system_prompt", { sessionId, value });
}
