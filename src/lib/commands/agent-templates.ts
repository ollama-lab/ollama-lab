import { invoke } from "@tauri-apps/api/core";
import { AgentListItem } from "../models/agent";

export async function listAllAgentTemplates(): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agent_templates");
}
