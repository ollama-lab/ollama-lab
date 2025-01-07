import type { ChatHistory, Session } from "$lib/models/session"
import { derived, writable } from "svelte/store"

export const currentSessionId = writable<number | undefined>()

export const sessions = writable<Session[] | undefined>()

export const chatHistory = derived([sessions, currentSessionId], ([$s, $c], set) => {
  // TODO: Add logic
  set({
    sessionId: 1,
    bubbles: [],
  } satisfies ChatHistory)
})
