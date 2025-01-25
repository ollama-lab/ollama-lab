import type { ChatBubble } from "$lib/models/session"
import { writable } from "svelte/store"

const internalChatHistory = writable<ChatBubble[] | undefined>()

export const chatHistory = {
  subscribe: internalChatHistory.subscribe,
  async submit() {
  },
}
