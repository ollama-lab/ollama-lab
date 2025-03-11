export interface Agent {
  id: number;
  name?: string;
  model: string;
  systemPrompt?: string;
  dateCreated: Date,
}

export interface AgentCreation {
  model: string;
}

export interface AgentUpdate {
  name?: string;
  model?: string;
  systemPrompt?: string;
}
