import { createStore, produce } from "solid-js/store";
import { Session } from "../models/session";
import { getSession, listSessions } from "../commands/sessions";

const [sessions, setSessions] = createStore<Session[]>([]);

export async function reloadSessions() {
  setSessions(await listSessions());
}

export async function reloadSession(id: number) {
  const session = await getSession(id);
  if (!session) {
    return;
  }

  setSessions(
    produce((cur) => {
      const index = cur.findIndex((value) => value.id === id);
      if (index < 0) {
        cur.unshift(session);
        return;
      }

      cur[index] = session;
    }),
  );
}

export function getAllSessions() {
  return sessions;
}
