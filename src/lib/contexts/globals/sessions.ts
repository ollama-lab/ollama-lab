import { produce } from "solid-js/store";
import { getSession, listSessions } from "../../commands/sessions";
import { createResource } from "solid-js";

const [sessions, { mutate, refetch }] = createResource(async () => await listSessions());

export async function reloadSessions() {
  const ret = refetch();
  if (ret instanceof Promise) {
    return await ret;
  }

  return ret;
}

export async function reloadSession(id: number) {
  const session = await getSession(id);
  if (!session) {
    return;
  }

  mutate(
    produce((cur) => {
      if (!cur) {
        return;
      }

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
  return sessions();
}
