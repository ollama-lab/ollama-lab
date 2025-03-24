import { createResource, createSignal } from "solid-js";
import { currentSession } from "./current-session";
import { listAllAgents } from "~/lib/commands/agents";

const [sessionAgents] = createResource(() => currentSession()?.id, async (sessionId) => {
  return await listAllAgents(sessionId);
});

const [selectedSessionAgent, setSelectedSessionAgent] = createSignal<number>();

export { sessionAgents, selectedSessionAgent, setSelectedSessionAgent };
