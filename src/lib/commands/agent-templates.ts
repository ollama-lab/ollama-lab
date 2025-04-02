import { invoke } from "@tauri-apps/api/core";
import { AgentListItem } from "../schemas/agent";
import { AgentTemplate, AgentTemplateCreation, agentTemplateSchema, AgentTemplateUpdate } from "../schemas/agent-template";
import { nullIsUndefined } from "../utils/schemas/transforms";

const optionalAgentTemplateSchema = agentTemplateSchema.nullable().transform(nullIsUndefined);

export async function listAllAgentTemplates(): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agent_templates");
}

export async function getAgentTemplate(id: number): Promise<AgentTemplate | undefined> {
  return await optionalAgentTemplateSchema.parseAsync(await invoke("get_agent_template", { id }));
}

export async function addAgentTemplate(createInfo: AgentTemplateCreation): Promise<AgentTemplate> {
  return await agentTemplateSchema.parseAsync(await invoke("add_agent_template", { model: createInfo.model }));
}

export async function updateAgentTemplate(id: number, updateInfo: AgentTemplateUpdate): Promise<AgentTemplate | undefined> {
  return await optionalAgentTemplateSchema.parseAsync(await invoke("update_agent_template", { id, ...updateInfo }));
}

export async function deleteAgentTemplate(id: number): Promise<number | undefined> {
  return await invoke<number | null>("delete_agent_template", { id }) ?? undefined;
}
