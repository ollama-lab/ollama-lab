import { createStore, produce, reconcile } from "solid-js/store";
import { createSession, getSession, listSessions } from "../../commands/sessions";
import { SessionMode, sessionModeSchema, sessionSchema } from "~/lib/schemas/session";
import { z } from "zod";
import { applySession } from "./current-session";

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

export interface NewSessionProps {
  /**
   * Whether switching to the new session right away (default: `true`)
   */
  switchToIt?: boolean;
}

export async function newSession(mode: SessionMode, initialModel: string, title: string, props: NewSessionProps = {}) {
  const session = await createSession(mode, initialModel, title);
  setSessions(mode, (prev) => [
    session,
    ...(prev ?? [])
  ]);

  if (props.switchToIt ?? true) {
    applySession(session, mode);
  }

  return session;
}
