import { createStore, produce, reconcile } from "solid-js/store";
import { getSession, listSessions } from "../../commands/sessions";
import { SessionMode, sessionModeSchema, sessionSchema } from "~/lib/schemas/session";
import { z } from "zod";

const sessionStoreSchema = z.record(sessionModeSchema, z.array(sessionSchema));
type SessionStore = z.infer<typeof sessionStoreSchema>;

const [sessions, setSessions] = createStore<SessionStore>(sessionStoreSchema.parse({}));

export async function reloadSessions(mode: SessionMode) {
  setSessions(mode, await listSessions(mode));
}

export async function reloadSession(id: number, mode: SessionMode) {
  const session = await getSession(id);
  if (!session || session.mode !== mode) {
    return;
  }

  const index = sessions[mode]?.findIndex((value) => value.id === session.id);
  if (index !== undefined) {
    if (index < 0) {
      setSessions(mode, produce((cur) => {
        cur?.unshift(session);
      }));
      return;
    }

    setSessions(mode, index, reconcile(session));
  }
  return session;
}

export function getAllSessions(mode: SessionMode) {
  return sessions[mode];
}
