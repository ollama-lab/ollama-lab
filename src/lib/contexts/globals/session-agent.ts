import { createResource } from "solid-js";
import { currentSession } from "./current-session";
import { listAllAgents } from "~/lib/commands/agents";

const [sessionAgents] = createResource(() => currentSession()?.id, async (sessionId) => {
  return await listAllAgents(sessionId);
});

export { sessionAgents };
