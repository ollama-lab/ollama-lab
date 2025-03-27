export interface AgentTemplate {
  id: number;
  name?: string;
  model: string;
  systemPrompt?: string;
  dateCreated: Date,
}

export interface AgentTemplateCreation {
  model: string;
}

export interface AgentTemplateUpdate {
  name?: string;
  model?: string;
  systemPrompt?: string;
}
