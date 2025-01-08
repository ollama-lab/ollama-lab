import type { Session } from "$lib/models/session"
import { writable } from "svelte/store"

export const currentSessionId = writable<number | undefined>()

export const sessions = writable<Session[] | undefined>()
