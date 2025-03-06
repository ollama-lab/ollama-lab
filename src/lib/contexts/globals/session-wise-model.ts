import { createSignal } from "solid-js";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";
import { currentSession, reloadCurrentSession } from "./current-session";
import { defaultModel } from "./model-states";

const [candidate, setCandidate] = createSignal<string | null>(null);

export function getSessionWiseModel(): string | null {
  const session = currentSession();
  if (session) {
    return session.currentModel;
  }

  const def = defaultModel();
  if (def) {
    return def;
  }

  return candidate() ?? null;
}

export async function setSessionWiseModel(value: string) {
  const session = currentSession();

  if (session) {
    await setSessionModelCommand(session.id, value);
    await reloadCurrentSession();
    setCandidate(null);
  } else {
    setCandidate(value);
  }
}
