import { createResource, createSignal } from "solid-js";
import { getSession } from "~/lib/commands/sessions";
import { getAllSessions, reloadSession } from "~/lib/contexts/globals/sessions";

const [sessionId, setSessionId] = createSignal<number | null>(null);

const [currentSession, { refetch }] = createResource(sessionId, async (id) => {
  if (id === null) {
    return null;
  }

  const loadedSessions = getAllSessions()?.find((item) => item.id === id);
  if (loadedSessions) {
    return loadedSessions;
  }

  return await getSession(id);
});

export { sessionId, setSessionId, currentSession };

export async function reloadCurrentSession() {
  const id = sessionId();
  if (id === null) {
    return;
  }

  await reloadSession(id)
  return refetch();
}
