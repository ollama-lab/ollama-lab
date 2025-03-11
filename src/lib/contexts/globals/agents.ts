import { createStore } from "solid-js/store";
import { getAllAgents } from "~/lib/commands/agents";
import { Agent } from "~/lib/models/agent";

const [agentList, setAgentList] = createStore<Agent[]>([]);

export function getAgentList() {
  return agentList;
}

export async function reloadAgentList() {
  setAgentList(await getAllAgents());
}
