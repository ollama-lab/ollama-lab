import { createStore, produce, reconcile } from "solid-js/store";
import { listAllAgentTemplates } from "~/lib/commands/agent-templates";
import { AgentListItem } from "~/lib/models/agent";
import { AgentTemplateCreation, AgentTemplateUpdate } from "~/lib/models/agent-template";
import {
  addAgentTemplate as addAgentTemplate_,
  updateAgentTemplate as updateAgentTemplate_,
  deleteAgentTemplate as deleteAgentTemplate_,
} from "~/lib/commands/agent-templates";
import { createSignal } from "solid-js";

const [selectedAgentTemplate, setSelectedAgentTemplate] = createSignal<number>();

const [agentTemplates, setAgentTemplates] = createStore<AgentListItem[]>([]);

export function getAgentTemplateList() {
  return agentTemplates;
}

export async function reloadAgentTemplateList() {
  setAgentTemplates(reconcile(await listAllAgentTemplates()));
}

export async function addAgentTemplate(createInfo: AgentTemplateCreation) {
  const item = await addAgentTemplate_(createInfo);
  setAgentTemplates(agentTemplates.length, item);
  return item.id;
}

export async function updateAgentTemplate(id: number, updateInfo: AgentTemplateUpdate) {
  const index = agentTemplates.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const newValue = await updateAgentTemplate_(id, updateInfo);
  if (newValue) {
    setAgentTemplates(index, reconcile({ id: newValue.id, name: newValue.name ?? null, model: newValue.model }));
  }
}

export async function deleteAgentTemplate(id: number) {
  const index = agentTemplates.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const deletedId = await deleteAgentTemplate_(id);
  if (deletedId !== null) {
    setAgentTemplates(produce((list) => {
      list.splice(index, 1);
    }));

    setSelectedAgentTemplate((cur) => cur === deletedId ? undefined : cur);
  }
}

export { selectedAgentTemplate, setSelectedAgentTemplate };
