import { createStore } from "solid-js/store";
import { getSession } from "~/lib/commands/sessions";
import { getAllSessions, reloadSession } from "~/lib/contexts/globals/sessions";
import { Session, SessionMode } from "~/lib/schemas/session";
import { setSessionModel } from "./current-model";

export type SessionStore = Record<SessionMode, Session | undefined>;

const [currentSessionStore, setCurrentSession] = createStore<SessionStore>({
  normal: undefined,
  h2h: undefined,
});

export function getCurrentSessionStore() {
  return currentSessionStore;
}

export function currentSession(mode: SessionMode) {
  return currentSessionStore[mode];
}

export async function setCurrentSessionId(id: number | null, mode: SessionMode) {
  if (id === null) {
    setCurrentSession(mode, undefined);
    return;
  }

  const session = await getSession(id);

  setCurrentSession(mode, session ?? undefined);
}

export function applySession(session: Session | null, mode: SessionMode) {
  if (!session) {
    setCurrentSession(mode, undefined);
    return;
  }

  if (getAllSessions(mode)?.find((item) => session.id === item.id)) {
    setCurrentSession(mode, session);
  }
}

export async function reloadCurrentSession(mode: SessionMode) {
  const id = currentSessionStore[mode]?.id;
  if (id === undefined) {
    return;
  }

  const session = await reloadSession(id, mode);
  setCurrentSession(mode, session);
}

export async function deselectModel(model: string, toModel: string) {
  for (const key of Object.keys(currentSessionStore)) {
    const key_ = key as SessionMode;
    const s = currentSessionStore[key_];
    if (s) {
      const curModel = s.currentModel;
      if (curModel === model) {
        await setSessionModel(toModel, key_)
      }
    }
  }
}
