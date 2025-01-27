import { getCurrentBranch } from "$lib/commands/chat-history"
import { submitUserPrompt, type PromptResponseEvents } from "$lib/commands/chats"
import type { ChatBubble } from "$lib/models/session"
import { get, writable } from "svelte/store"
import { selectedSessionModel } from "./models"
import type { ChatGenerationReturn, IncomingUserPrompt } from "$lib/models/chat"
import { createSession } from "$lib/commands/sessions"
import { sessions } from "./sessions"
import { toast } from "svelte-sonner"

export interface ChatHistory {
  session: number
  chats: ChatBubble[]
  loading: boolean
}

const internalChatHistory = writable<ChatHistory | undefined>()

export interface PromptSubmissionEvents {
  onScrollDown?: () => void
}

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
  async submit(prompt: IncomingUserPrompt, {
    onScrollDown,
  }: PromptSubmissionEvents = {}): Promise<void> {
    const model = get(selectedSessionModel)
    if (!model) {
      throw new Error("No model selected.")
    }

    let ch = get(internalChatHistory)
    if (!ch) {
      const session = await createSession(model)
      await sessions.reloadSession(session.id)
      await chatHistory.setSessionId(session.id)

      ch = get(internalChatHistory)!
    }

    const parentId = ch.chats.length < 1 ? null : ch.chats[ch.chats.length - 1].id
    let userPromptSynced = false

    let responseIndex = -1

    const ret = await submitUserPrompt(ch.session, prompt, parentId, {
      afterUserPromptSubmitted(id: number, date: Date): void {
        if (!userPromptSynced) {
          internalChatHistory.update(ch => {
            ch?.chats.push({
              id,
              status: "sent",
              content: prompt.text,
              role: "user",
              dateSent: date,
            })

            return ch
          })
          userPromptSynced = true
          onScrollDown?.()
        }
      },
      afterResponseCreated(id: number): void {
        if (responseIndex < 0) {
          internalChatHistory.update(ch => {
            const length = ch?.chats.push({
              id,
              status: "preparing",
              role: "assistant",
              content: "",
              model,
            })

            if (length !== undefined) {
              responseIndex = length - 1
            }

            return ch
          })

          onScrollDown?.()
        }
      },
      onStreamText(chunk: string): void {
        if (responseIndex < 0) {
          return
        }

        internalChatHistory.update(ch => {
          if (ch) {
            let chat = ch.chats[responseIndex]
            chat.content += chunk
            chat.status = "sending"
          }

          return ch
        })

        onScrollDown?.()
      },
      onCompleteTextStreaming(): void {
        internalChatHistory.update(ch => {
          if (ch) {
            ch.chats[responseIndex].status = "sent"
          }
          return ch
        })
      },
      onFail(msg): void {
        internalChatHistory.update(ch => {
          if (ch) {
            ch.chats[responseIndex].status = "not sent"
          }
          return ch
        })
        
        if (msg) {
          toast.error(msg)
        }
      },
      onCancel(msg): void {
        internalChatHistory.update(ch => {
          if (ch) {
            ch.chats[responseIndex].status = "not sent"
          }
          return ch
        })
        
        if (msg) {
          toast.warning(msg)
        }
      },
    })

    internalChatHistory.update(ch => {
      if (ch) {
        let chat = ch.chats[responseIndex]
        chat.status = "sent"
        chat.dateSent = ret.dateCreated
      }

      return ch
    })
  },
  async regenerate(prompt: IncomingUserPrompt, {
    onScrollDown,
  }: PromptSubmissionEvents = {}) {
    // TODO: Add regeneration logic
  },
  async switchBranch() {
    // TODO: Add switch branch logic
  },
}
