import { createSignal } from "solid-js";
import { getAllSessions, reloadSession } from "./sessions";
import { getChatHistory } from "./chat-history";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";

const [candidate, setCandidate] = createSignal<string | null>(null);

export function getSessionWiseModel(): string | null {
  const sessions = getAllSessions();
  const currentSession = getChatHistory()?.session;
  if (sessions.length > 0 && currentSession !== undefined) {
    return sessions.find((s) => s.id === currentSession)?.currentModel ?? null;
  }

  return candidate();
}

export async function setSessionWiseModel(value: string) {
  const sessions = getAllSessions();
  const currentSession = getChatHistory()?.session;

  if (sessions.length > 0 && currentSession !== undefined) {
    await setSessionModelCommand(currentSession, value);
    await reloadSession(currentSession);
    setCandidate(null);
  } else {
    setCandidate(value);
  }
}
