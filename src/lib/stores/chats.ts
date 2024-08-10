import { derived } from "svelte/store"
import { currentSession, sessionList } from "./sessions"
import type { Feed } from "$lib/models/feed"

export const chatBubbles = derived([sessionList, currentSession], () => {
  // TODO
  return [] as Feed[]
})
