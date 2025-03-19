export interface Agent {
  id: number;
  name?: string;
  model: string;
  systemPrompt?: string;
  sessionId: number,
  templateId?: number,
  dateCreated: Date,
}

export interface AgentUpdate {
  name?: string;
  model?: string;
  systemPrompt?: string;
  sessionId?: number,
  templateId?: [number | null],
}

export interface AgentListItem {
  id: number;
  name: string | null;
  model: string;
}
