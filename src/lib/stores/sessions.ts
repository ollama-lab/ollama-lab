import { getSession, listSessions } from "$lib/commands/sessions"
import type { Session } from "$lib/models/session"
import { writable } from "svelte/store"

const internalSessions = writable<Session[] | undefined>()

export const sessions = {
  subscribe: internalSessions.subscribe,
  async reload() {
    internalSessions.set(await listSessions())
  },
  async reloadSession(id: number) {
    const session = await getSession(id)
    if (session) {
      internalSessions.update((sessions) => {
        if (sessions) {
          const index = sessions.findIndex(value => value.id === id)
          if (index < 0) {
            return
          }

          sessions[index] = session
        }

        return sessions
      })
    }
  },
}
