import { createStore, produce, reconcile } from "solid-js/store";
import { listAllAgentTemplates } from "~/lib/commands/agent-templates";
import { AgentListItem } from "~/lib/models/agent";
import { AgentTemplateCreation, AgentTemplateUpdate } from "~/lib/models/agent-template";
import {
  
} from "~/lib/commands/agent-templates";

const [agentTemplates, setAgentTemplates] = createStore<AgentListItem[]>([]);

export function getAgentTemplateList() {
  return agentTemplates;
}

export async function reloadAgentTemplateList() {
  setAgentTemplates(reconcile(await listAllAgentTemplates()));
}

export async function addAgentTemplate(createInfo: AgentTemplateCreation) {
  setAgentTemplates(agentTemplates.length, await addAgent_(createInfo.model));
}

export async function updateAgentTemplate(id: number, updateInfo: AgentTemplateUpdate) {
  const index = agentTemplates.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const newValue = await updateAgent_(id, updateInfo);
  if (newValue) {
    setAgentTemplates(index, reconcile(newValue));
  }
}

export async function deleteAgentTemplate(id: number) {
  const index = agentTemplates.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const deletedId = await deleteAgent_(id);
  if (deletedId !== null) {
    setAgentTemplates(produce((list) => {
      list.splice(index, 1);
    }));
  }
}
