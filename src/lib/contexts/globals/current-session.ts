import { createStore, reconcile } from "solid-js/store";
import { getSession } from "~/lib/commands/sessions";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { Session, SessionMode } from "~/lib/models/session";
import { setSessionModel } from "./current-model";

export type SessionStore = Record<SessionMode, {
  session: Session;
  newSession: boolean;
} | undefined>;

const [currentSessionStore, setCurrentSession] = createStore<SessionStore>({
  normal: undefined,
  h2h: undefined,
});

export function getCurrentSessionStore() {
  return currentSessionStore;
}

export function currentSession(mode: SessionMode) {
  return currentSessionStore[mode]?.session;
}

export async function setCurrentSessionId(id: number | null, mode: SessionMode) {
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

export async function setNewSession(id: number, mode: SessionMode) {
  const session = await getSession(id);

  setCurrentSession(mode, session ? reconcile({
    session,
    newSession: true,
  }) : undefined);
}

export async function reloadCurrentSession(mode: SessionMode) {
  const id = currentSessionStore[mode]?.session?.id;
  if (id === undefined) {
    return;
  }

  const session = await reloadSession(id, mode);
  setCurrentSession(mode, session ? reconcile({
    session,
    newSession: false,
  }) : undefined);
}

export function isNewSession(mode: SessionMode) {
  return currentSessionStore[mode]?.newSession ?? true;
}

export async function deselectModel(model: string, toModel: string) {
  for (const key of Object.keys(currentSessionStore)) {
    const key_ = key as SessionMode;
    const s = currentSessionStore[key_];
    if (s) {
      const curModel = s.session.currentModel;
      if (curModel === model) {
        await setSessionModel(toModel, key_)
      }
    }
  }
}
