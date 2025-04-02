import { invoke } from "@tauri-apps/api/core";
import { AgentListItem } from "../schemas/agent";
import { AgentTemplate, AgentTemplateCreation, AgentTemplateUpdate } from "../schemas/agent-template";

export async function listAllAgentTemplates(): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agent_templates");
}

export async function getAgentTemplate(id: number): Promise<AgentTemplate | null> {
  return await invoke<AgentTemplate | null>("get_agent_template", { id });
}

export async function addAgentTemplate(createInfo: AgentTemplateCreation): Promise<AgentTemplate> {
  return await invoke<AgentTemplate>("add_agent_template", { model: createInfo.model });
}

export async function updateAgentTemplate(id: number, updateInfo: AgentTemplateUpdate): Promise<AgentTemplate | null> {
  return await invoke<AgentTemplate | null>("update_agent_template", { id, ...updateInfo });
}

export async function deleteAgentTemplate(id: number): Promise<number | null> {
  return await invoke<number | null>("delete_agent_template", { id });
}
