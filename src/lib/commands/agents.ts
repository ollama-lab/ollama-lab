import { invoke } from "@tauri-apps/api/core";
import { Agent, AgentListItem, AgentUpdate } from "../models/agent";

interface InternalAgent {
  id: number;
  name: string | null;
  model: string;
  systemPrompt: string | null;
  sessionId: number,
  templateId?: number,
  dateCreated: Date,
}

function toAgent(internal: InternalAgent): Agent {
  return {
    ...internal,
    name: internal.name ?? undefined,
    systemPrompt: internal.systemPrompt ?? undefined,
    templateId: internal.templateId ?? undefined,
  };
}

export async function getAgent(id: number): Promise<Agent | undefined> {
  return await invoke<InternalAgent | null>("get_agent", { id })
    .then((item) => item ? toAgent(item) : undefined);
}

export async function addAgent(model: string): Promise<Agent> {
  return toAgent(await invoke<InternalAgent>("add_agent", { model }));
}

export async function updateAgent(id: number, updateInfo: AgentUpdate): Promise<Agent | undefined> {
  return await invoke<InternalAgent | null>("update_agent", { id, updateInfo })
    .then((item) => item ? toAgent(item) : undefined);
}

export async function deleteAgent(id: number): Promise<number | undefined> {
  return (await invoke<number | null>("delete_agent", { id })) ?? undefined;
}

export async function getSelectedAgents(sessionId: number): Promise<Agent[]> {
  return (await invoke<InternalAgent[]>("get_selected_agents", { sessionId })).map((item) => toAgent(item));
}

export async function addSelectedAgent(sessionId: number, agentId: number): Promise<void> {
  await invoke<void>("add_selected_agent", { sessionId, agentId });
}

export async function removeSelectedAgent(sessionId: number, agentId: number): Promise<void> {
  await invoke<void>("remove_selected_agent", { sessionId, agentId });
}

export async function listAllAgents(sessionId?: number): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agents", { sessionId });
}
