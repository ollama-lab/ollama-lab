import { listSessions } from "$lib/commands/sessions"
import type { Session } from "$lib/models/session"
import { writable } from "svelte/store"

const internalSessions = writable<Session[] | undefined>()

export const currentSessionId = writable<number | undefined>()

export const sessions = {
  subscribe: internalSessions.subscribe,
  async reload() {
    internalSessions.set(await listSessions())
  },
}
