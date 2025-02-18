import { getCurrentBranch, switchBranch } from "$lib/commands/chat-history"
import { regenerateResponse, submitUserPrompt } from "$lib/commands/chats"
import type { ChatBubble } from "$lib/models/session"
import { derived, get, writable } from "svelte/store"
import { selectedSessionModel } from "./models"
import type { IncomingUserPrompt } from "$lib/models/chat"
import { createSession } from "$lib/commands/sessions"
import { sessions } from "./sessions"
import { convertResponseEvents } from "$lib/utils/chat-streams"

export interface ChatHistory {
  session: number
  chats: ChatBubble[]
  loading: boolean
}

const internalChatHistory = writable<ChatHistory | undefined>()

export interface PromptSubmissionEvents {
  onRespond?: () => void
  onScrollDown?: () => void
}

export const chatHistory = {
  subscribe: internalChatHistory.subscribe,
  async reload(): Promise<void> {
    let sessionId: number | undefined = get(internalChatHistory)?.session

    if (sessionId !== undefined) {
      internalChatHistory.update((value) => {
        if (value && !value.loading) {
          value.loading = true
          sessionId = value.session
        }

        return value
      })

      try {
        const chats = await getCurrentBranch(sessionId)
        internalChatHistory.set({
          session: sessionId,
          chats,
          loading: false,
        })
      } catch (err) {
        internalChatHistory.update((value) => {
          if (value) {
            value.loading = false
          }
          return value
        })
        throw err
      }
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
      loading: false,
    })

    await this.reload()
  },
  async clear(): Promise<void> {
    await this.setSessionId(null)
  },
  async submit(prompt: IncomingUserPrompt, {
    onRespond,
    onScrollDown,
  }: PromptSubmissionEvents = {}): Promise<void> {
    const model = get(selectedSessionModel)
    if (!model) {
      throw new Error("No model selected.")
    }

    let ch = get(internalChatHistory)
    if (!ch) {
      // TODO: Add settings option for default session name: 1) no name, 2) first prompt, 3) generated after first response
      // Currently it is `first prompt`
      const session = await createSession(model, prompt.text.split("\n").at(0))
      await sessions.reloadSession(session.id)
      await chatHistory.setSessionId(session.id)

      ch = get(internalChatHistory)!
    }

    const parentId = ch.chats.length < 1 ? null : ch.chats[ch.chats.length - 1].id

    let ctx = {
      responseIndex: -1,
    }

    const ret = await submitUserPrompt(
      ch.session,
      prompt,
      parentId,
      convertResponseEvents(ctx, internalChatHistory, model, prompt, { onRespond, onScrollDown }),
    )

    internalChatHistory.update(ch => {
      if (ch) {
        let chat = ch.chats[ctx.responseIndex]
        chat.status = "sent"
        chat.dateSent = ret.dateCreated
      }

      return ch
    })
  },
  async regenerate(chatId: number, model?: string, {
    onRespond,
    onScrollDown,
  }: PromptSubmissionEvents = {}): Promise<void> {
    const ch = get(internalChatHistory)
    if (!ch) {
      return
    }

    let ctx = {
      responseIndex: -1,
    }

    const ret = await regenerateResponse(
      ch.session,
      chatId,
      model,
      convertResponseEvents(ctx, internalChatHistory, model, undefined, { onRespond, onScrollDown }, {
        regenerateFor: chatId,
      }),
    )

    internalChatHistory.update(ch => {
      if (ch) {
        let chat = ch.chats[ctx.responseIndex]
        chat.status = "sent"
        chat.dateSent = ret.dateCreated
      }

      return ch
    })
  },
  async switchBranch(chatId: number) {
    const [parentId, currentBranchFromCurrentNode] = await switchBranch(chatId)

    internalChatHistory.update(ch => {
      if (ch) {
        const index = parentId !== null ? ch.chats.findIndex(chat => chat.id === parentId) + 1 : 0
        if (index >= 0) {
          ch.chats = [
            ...ch.chats.slice(0, index),
            ...currentBranchFromCurrentNode,
          ]
        }
      }

      return ch
    })
  },
  async editPrompt(prompt: IncomingUserPrompt, chatId: number, {
    onRespond,
    onScrollDown,
  }: PromptSubmissionEvents = {}) {
    const model = get(selectedSessionModel)
    if (!model) {
      throw new Error("No model selected.")
    }

    let ch = get(internalChatHistory)
    if (!ch) {
      throw new Error("No chat history")
    }

    const curIndex = ch.chats.findIndex(value => value.id === chatId)
    if (curIndex < 0) {
      throw new Error("Original chat not found")
    }

    const parentId = curIndex === 0 ? null : ch.chats[curIndex - 1].id

    let ctx = {
      responseIndex: -1,
    }

    const ret = await submitUserPrompt(
      ch.session,
      prompt,
      parentId,
      convertResponseEvents(ctx, internalChatHistory, model, prompt, { onRespond, onScrollDown }, {
        regenerateFor: ch.chats[curIndex].id,
      }),
    )

    internalChatHistory.update(ch => {
      if (ch) {
        let chat = ch.chats[ctx.responseIndex]
        chat.status = "sent"
        chat.dateSent = ret.dateCreated
      }

      return ch
    })
  },
}

export const lastChat = derived(chatHistory, ($ch) => $ch?.chats.at(-1))
