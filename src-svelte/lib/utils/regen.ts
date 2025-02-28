import { chatHistory } from "$lib/stores/chats"
import { get } from "svelte/store"

export async function regenerate(chatId: number, model?: string): Promise<void> {
  const ch = get(chatHistory)
  if (!ch) {
    return
  }

  await chatHistory.regenerate(chatId, model)
}

export async function regenerateLast(): Promise<void> {
  const ch = get(chatHistory)
  if (!ch) {
    return
  }

  const lastChat = ch.chats.at(-1)
  if (lastChat) {
    await chatHistory.regenerate(lastChat.id, lastChat.model)
  }
}
