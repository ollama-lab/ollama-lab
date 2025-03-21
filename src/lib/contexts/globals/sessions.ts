import { createStore, produce, reconcile } from "solid-js/store";
import { getSession, listSessions } from "../../commands/sessions";
import { Session } from "~/lib/models/session";
import { createEffect } from "solid-js";

const [sessions, setSessions] = createStore<Session[]>([]);

export async function reloadSessions() {
  setSessions(await listSessions("normal"));
}

createEffect(() => {
  reloadSessions();
});

export async function reloadSession(id: number) {
  const session = await getSession(id);
  if (!session) {
    return;
  }

  const index = sessions.findIndex((value) => value.id === session.id);
  if (index < 0) {
    setSessions(produce((cur) => {
      cur.unshift(session);
    }));
    return;
  }

  setSessions(index, reconcile(session));
  return session;
}

export function getAllSessions() {
  return sessions;
}
