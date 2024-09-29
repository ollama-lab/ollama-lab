import { writable } from "svelte/store"
import { currentSession, sessionList } from "./sessions"
import type { Feed } from "$lib/models/feed"
import { getChatHistory } from "$lib/utils/commands"
import type { Session } from "$lib/models/sessions"

export const chatBubbles = (() => {
  const { subscribe, set, update } = writable<Feed[]>()

  let sessions: Session[] = []
  sessionList.subscribe(s => sessions = s)

  currentSession.subscribe(async value => {
    const currentSession = value !== null ? sessions.find(s => s.id === value) : undefined

    set(currentSession ? (await getChatHistory(value!)).map(bubble => ({
      id: bubble.id,
      role: bubble.role,
      name: bubble.role === "assistant" ? (currentSession.model ?? "AI") : bubble.role === "user" ? currentSession.owner : "System",
      content: bubble.content,
      status: "completed",
      date: bubble.date_created,
      isEdited: bubble.is_edited,
    })) : [])
  })

  return {
    subscribe,
    append: (bubble: Feed) => update(cur => [...cur, bubble]),
    update,
    assignId: (id: number, index?: number) => update(cur => {
      if (cur.length < 1) {
        return cur
      }

      const item = index ? cur.at(index) : cur[cur.length - 1]
      if (!item) {
        return cur
      }

      item.id = id
      return [...cur]
    }),
    mutate: (index: number, overwrite: Feed) => update(cur => {
      cur[index] = overwrite
      return [...cur]
    }),
  }
})()
