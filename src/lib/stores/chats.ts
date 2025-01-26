import type { ChatBubble } from "$lib/models/session"
import { writable } from "svelte/store"

export interface ChatHistory {
  session: number
  chats: ChatBubble[]
}

const internalChatHistory = writable<ChatHistory | undefined>()

export const chatHistory = {
  subscribe: internalChatHistory.subscribe,
  async setSessionId(sessionId: number | null) {
    if (sessionId === null) {
      internalChatHistory.set(undefined)
      return
    }
  },
  async clear() {
    return this.setSessionId(null)
  },
  async submit() {
  },
  async regenerate() {
  },
  async switchBranch() {
  },
}
