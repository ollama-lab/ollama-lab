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

export async function getSessionAgent(id: number): Promise<Agent | undefined> {
  return await invoke<InternalAgent | null>("get_session_agent", { id })
    .then((item) => item ? toAgent(item) : undefined);
}

export async function addSessionAgent(templateId: number, sessionId: number): Promise<Agent> {
  return toAgent(await invoke<InternalAgent>("add_session_agent", { templateId, sessionId }));
}

export async function updateSessionAgent(id: number, updateInfo: AgentUpdate): Promise<Agent | undefined> {
  return await invoke<InternalAgent | null>("update_session_agent", { id, updateInfo })
    .then((item) => item ? toAgent(item) : undefined);
}

export async function deleteSessionAgent(id: number): Promise<number | undefined> {
  return (await invoke<number | null>("delete_session_agent", { id })) ?? undefined;
}

export async function listAllAgents(sessionId?: number): Promise<AgentListItem[]> {
  return await invoke<AgentListItem[]>("list_all_agents", { sessionId });
}
