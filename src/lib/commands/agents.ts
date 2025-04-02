import { invoke } from "@tauri-apps/api/core";
import { Agent, AgentListItem, agentSchema, AgentUpdate } from "../schemas/agent";
import { nullIsUndefined } from "../utils/schemas/transforms";

const optionalAgentSchema = agentSchema.nullable().transform(nullIsUndefined);

export async function getSessionAgent(id: number, sessionId: number): Promise<Agent | undefined> {
  return await optionalAgentSchema.parseAsync(await invoke("get_session_agent", { id, sessionId }));
}

export async function getGlobalSessionAgent(id: number): Promise<Agent | undefined> {
  return await optionalAgentSchema.parseAsync(await invoke("get_global_session_agent", { id }));
}

export async function addSessionAgent(templateId: number, sessionId: number): Promise<Agent> {
  return await agentSchema.parseAsync(await invoke("add_session_agent", { templateId, sessionId }));
}

export async function updateSessionAgent(id: number, updateInfo: AgentUpdate): Promise<Agent | undefined> {
  return await optionalAgentSchema.parseAsync(await invoke("update_session_agent", { id, updateInfo }));
}

export async function deleteSessionAgent(id: number): Promise<number | undefined> {
  return (await invoke<number | null>("delete_session_agent", { id })) ?? undefined;
}

export async function listAllAgents(sessionId?: number): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agents", { sessionId });
}
