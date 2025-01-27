import { getCurrentBranch } from "$lib/commands/chat-history"
import type { ChatBubble } from "$lib/models/session"
import { writable } from "svelte/store"

export interface ChatHistory {
  session: number
  chats: ChatBubble[]
  loading: boolean
}

const internalChatHistory = writable<ChatHistory | undefined>()

export const chatHistory = {
  subscribe: internalChatHistory.subscribe,
  async reload(): Promise<void> {
    let sessionId: number | undefined = undefined

    internalChatHistory.update((value) => {
      if (value && !value.loading) {
        value.loading = true
        sessionId = value.session
      }

      return value
    })

    if (sessionId !== undefined) {
      const chats = await getCurrentBranch(sessionId)
      internalChatHistory.set({
        session: sessionId,
        chats,
        loading: false,
      })
    }
  },
  async setSessionId(sessionId: number | null): Promise<void> {
    if (sessionId === null) {
      internalChatHistory.set(undefined)
      return
    }

    internalChatHistory.set({
      session: sessionId,
      chats: [],
      loading: true,
    })

    await this.reload()
  },
  async clear(): Promise<void> {
    await this.setSessionId(null)
  },
  async submit() {
    // TODO: Add submission logic
  },
  async regenerate() {
    // TODO: Add regeneration logic
  },
  async switchBranch() {
    // TODO: Add switch branch logic
  },
}
