import type { PromptResponseEvents } from "$lib/commands/chats"
import type { IncomingUserPrompt } from "$lib/models/chat"
import type { ChatHistory, PromptSubmissionEvents } from "$lib/stores/chats"
import { emit } from "@tauri-apps/api/event"
import { toast } from "svelte-sonner"
import type { Writable } from "svelte/store"

export interface ResponseStreamingContext {
  responseIndex: number
}

export interface ConvertResponseEventsProps {
  regenerateFor?: number
}

export function convertResponseEvents(
  context: ResponseStreamingContext,
  internalChatHistory: Writable<ChatHistory | undefined>,
  model?: string,
  prompt?: IncomingUserPrompt,
  { onScrollDown, onRespond }: PromptSubmissionEvents = {},
  { regenerateFor }: ConvertResponseEventsProps = {},
): PromptResponseEvents {
  let currentChatId: number | undefined = undefined

  return {
    afterUserPromptSubmitted: regenerateFor ? undefined : (id: number, date: Date): void => {
      internalChatHistory.update(ch => {
        ch?.chats.push({
          id,
          status: "sent",
          content: prompt?.text ?? "",
          role: "user",
          dateSent: date,
          versions: null,
        })

        return ch
      })
      onScrollDown?.()
    },
    afterResponseCreated(id: number): void {
      if (context.responseIndex >= 0) {
        return
      }

      currentChatId = id

      internalChatHistory.update(ch => {
        if (ch) {
          if (regenerateFor) {
            const i = ch.chats.findIndex((value) => value.id === regenerateFor)
            if (i < 0) {
              return ch
            }

            const chat = ch.chats[i]
            const existingVersions = chat.versions ?? []

            ch.chats = [
              ...ch.chats.slice(0, i),
              {
                id,
                content: "",
                status: "preparing",
                role: "assistant",
                model: model ?? chat.model,
                versions: [...existingVersions, id],
              },
            ]

            context.responseIndex = ch.chats.length - 1
          } else {
            const length = ch.chats.push({
              id,
              status: "preparing",
              role: "assistant",
              content: "",
              model,
              versions: null,
            })

            if (length !== undefined) {
              context.responseIndex = length - 1
            }
          }
        }

        return ch
      })

      onRespond?.()
      onScrollDown?.()
    },
    onStreamText(chunk: string): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats.at(context.responseIndex)

          if (!chat || currentChatId !== chat.id) {
            emit("cancel-gen")
            return ch
          }

          if (ch.chats[context.responseIndex].thinking) {
            chat.thoughts = (chat.thoughts ?? "") + chunk
          } else {
            chat.content += chunk
          }
          chat.status = "sending"
        }

        return ch
      })

      onScrollDown?.()
    },
    onCompleteTextStreaming(): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats.at(context.responseIndex)
          if (chat && chat.id === currentChatId) {
            chat.status = "sent"
          }
        }
        return ch
      })

      currentChatId = undefined
    },
    onFail(msg): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats[context.responseIndex]
          if (chat && chat.id === currentChatId) {
            chat.status = "not sent"
          }
        }
        return ch
      })

      currentChatId = undefined
      
      if (msg) {
        toast.error(msg)
      }
    },
    onCancel(_): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats[context.responseIndex]
          if (chat && chat.id === currentChatId) {
            chat.status = "not sent"
          }
        }
        return ch
      })

      currentChatId = undefined
    },
    onThoughtBegin(): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats.at(context.responseIndex)
          if (chat && chat.id === currentChatId) {
            chat.thinking = true
            chat.status = "sending"
          }
        }

        return ch
      })
    },
    onThoughtEnd(thoughtFor: number | null): void {
      if (context.responseIndex < 0) {
        return
      }

      internalChatHistory.update(ch => {
        if (ch) {
          let chat = ch.chats.at(context.responseIndex)
          if (chat && chat.id === currentChatId) {
            if (chat.thoughts) {
              const trimmedThoughts = chat.thoughts.trim()
              chat.thoughts = trimmedThoughts.length > 0 ? trimmedThoughts : null
            }
            chat.thinking = false
            chat.thoughtFor = thoughtFor
          }
        }

        return ch
      })
    },
  }
}
