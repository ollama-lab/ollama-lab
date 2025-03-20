import { createStore, reconcile } from "solid-js/store";
import { getSession } from "~/lib/commands/sessions";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { Session } from "~/lib/models/session";

export interface SessionStore {
  session: Session | null;
  newSession: boolean;
}

const [currentSessionStore, setCurrentSession] = createStore<SessionStore>({
  session: null,
  newSession: false,
});

export function currentSession() {
  return currentSessionStore.session;
}

export async function setCurrentSessionId(id: number | null) {
  if (id === null) {
    setCurrentSession(reconcile({
      session: null,
      newSession: false,
    }));
    return;
  }

  setCurrentSession(reconcile({
    session: await getSession(id),
    newSession: false,
  }));
}

export async function setNewSession(id: number) {
  setCurrentSession(reconcile({
    session: await getSession(id),
    newSession: true,
  }));
}

export async function reloadCurrentSession() {
  const id = currentSessionStore.session?.id;
  if (id === undefined) {
    return;
  }

  setCurrentSession(reconcile({
    session: await reloadSession(id) ?? null,
    newSession: false,
  }));
}

export function isNewSession() {
  return currentSessionStore.newSession;
}
