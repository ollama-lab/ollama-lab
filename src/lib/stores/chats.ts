import { getCurrentBranch } from "$lib/commands/chat-history"
import { regenerateResponse, submitUserPrompt } from "$lib/commands/chats"
import type { ChatBubble } from "$lib/models/session"
import { get, writable } from "svelte/store"
import { selectedSessionModel } from "./models"
import type { IncomingUserPrompt } from "$lib/models/chat"
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
      const session = await createSession(model, prompt.text)
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
        if (responseIndex >= 0) {
          return
        }

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

        onRespond?.()
        onScrollDown?.()
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
        if (responseIndex < 0) {
          return
        }

        internalChatHistory.update(ch => {
          if (ch) {
            ch.chats[responseIndex].status = "sent"
          }
          return ch
        })
      },
      onFail(msg): void {
        if (responseIndex < 0) {
          return
        }

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
        if (responseIndex < 0) {
          return
        }

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
  async regenerate(chatId: number, model?: string, {
    onRespond,
    onScrollDown,
  }: PromptSubmissionEvents = {}): Promise<void> {
    const ch = get(internalChatHistory)
    if (!ch) {
      return
    }

    let responseIndex = -1

    await regenerateResponse(ch.session, chatId, model, {
      afterResponseCreated(id): void {
        if (responseIndex >= 0) {
          return
        }

        internalChatHistory.update(ch => {
          if (ch) {
            const i = ch.chats.findIndex((value) => value.id === chatId)
            if (i < 0) {
              return ch
            }

            ch.chats = [
              ...ch.chats.slice(0, i),
              {
                id,
                content: "",
                status: "preparing",
                role: "assistant",
                model,
                hasOtherVersions: true,
              },
            ]

            responseIndex = ch.chats.length - 1
          }

          return ch
        })

        onRespond?.()
        onScrollDown?.()
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
        if (responseIndex < 0) {
          return
        }

        internalChatHistory.update(ch => {
          if (ch) {
            ch.chats[responseIndex].status = "sent"
          }
          return ch
        })
      },
      onFail(msg): void {
        if (responseIndex < 0) {
          return
        }

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
        if (responseIndex < 0) {
          return
        }

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
  },
  async switchBranch(chatId: number) {
  },
}
