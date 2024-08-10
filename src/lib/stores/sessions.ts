import type { Session } from "$lib/models/sessions"
import { writable } from "svelte/store"

export const sessionList = writable<Session[]>([])

export const currentSession = writable<number | null>(null)
