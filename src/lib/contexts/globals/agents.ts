import { createStore, produce, reconcile } from "solid-js/store";
import { getAllAgents, addAgent as addAgent_, updateAgent as updateAgent_, deleteAgent as deleteAgent_ } from "~/lib/commands/agents";
import { Agent, AgentCreation, AgentUpdate } from "~/lib/models/agent";

const [agentList, setAgentList] = createStore<Agent[]>([]);

export function getAgentList() {
  return agentList;
}

export async function reloadAgentList() {
  setAgentList(await getAllAgents());
}

export async function addAgent(createInfo: AgentCreation) {
  setAgentList(agentList.length, await addAgent_(createInfo.model));
}

export async function updateAgent(id: number, updateInfo: AgentUpdate) {
  const index = agentList.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const newValue = await updateAgent_(id, updateInfo);
  if (newValue) {
    setAgentList(index, reconcile(newValue));
  }
}

export async function deleteAgent(id: number) {
  const index = agentList.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const deletedId = await deleteAgent_(id);
  if (deletedId !== null) {
    setAgentList(produce((list) => {
      list.splice(index, 1);
    }));
  }
}
