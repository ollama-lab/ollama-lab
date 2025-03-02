import { invoke } from "@tauri-apps/api/core";

export async function initialize(): Promise<void> {
  await invoke("initialize");
}
