import { createStore, reconcile } from "solid-js/store";
import { getSession } from "~/lib/commands/sessions";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { Session, SessionMode } from "~/lib/models/session";

export type SessionStore = Record<SessionMode, {
  session: Session;
  newSession: boolean;
} | undefined>;

const [currentSessionStore, setCurrentSession] = createStore<SessionStore>({
  normal: undefined,
  h2h: undefined,
});

export function currentSession(mode: SessionMode = "normal") {
  return currentSessionStore[mode]?.session;
}

export async function setCurrentSessionId(id: number | null, mode: SessionMode = "normal") {
  if (id === null) {
    setCurrentSession(mode, undefined);
    return;
  }

  const session = await getSession(id);

  setCurrentSession(mode, session ? reconcile({
    session,
    newSession: false,
  }) : undefined);
}

export async function setNewSession(id: number, mode: SessionMode = "normal") {
  const session = await getSession(id);

  setCurrentSession(mode, session ? reconcile({
    session,
    newSession: true,
  }) : undefined);
}

export async function reloadCurrentSession(mode: SessionMode = "normal") {
  const id = currentSessionStore[mode]?.session?.id;
  if (id === undefined) {
    return;
  }

  const session = await reloadSession(id);
  setCurrentSession(mode, session ? reconcile({
    session,
    newSession: false,
  }) : undefined);
}

export function isNewSession(mode: SessionMode = "normal") {
  return currentSessionStore[mode]?.newSession ?? true;
}
