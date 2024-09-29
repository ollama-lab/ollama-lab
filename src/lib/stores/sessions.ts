import type { Session } from "$lib/models/sessions"
import { listSessions } from "$lib/utils/commands"
import { writable } from "svelte/store"
import refreshable from "./refreshable"

export const sessionList = refreshable<Session[]>([], async (set) => set(await listSessions()))

export const currentSession = writable<number | null>(null)
