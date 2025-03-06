import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { getSession } from "~/lib/commands/sessions";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { Session } from "~/lib/models/session";

const [sessionId, setSessionId] = createSignal<number | null>(null);

export interface SessionStore {
  session?: Session;
}

const [currentSessionStore, setCurrentSession] = createStore<SessionStore>({});

createEffect(() => {
  const id = sessionId();

  if (id === null) {
    setCurrentSession("session", undefined);
    return;
  }


  getSession(id).then((session) => setCurrentSession("session", session ?? undefined));
});

export function currentSession() {
  return currentSessionStore.session;
}

export { sessionId as currentSessionId, setSessionId as setCurrentSessionId };

export async function reloadCurrentSession() {
  const id = sessionId();
  if (id === null) {
    return;
  }

  setCurrentSession("session", await reloadSession(id));
}
