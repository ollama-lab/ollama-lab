import type { ChatGenerationReturn, IncomingUserPrompt } from "$lib/models/chat"
import type { StreamingResponseEvent } from "$lib/models/events/text-streams"
import { Channel, invoke } from "@tauri-apps/api/core"

interface InternalChatGenerationReturn {
  id: number
  dateCreated: string
}

export interface PromptResponseEvents {
  afterUserPromptSubmitted?: (id: number, date: Date) => void
  afterResponseCreated?: (id: number) => void
  onStreamText?: (chunk: string) => void
  onCompleteTextStreaming?: () => void
  onFail?: (msg: string | null) => void
  onCancel?: (msg: string | null) => void
}

export async function submitUserPrompt(
  sessionId: number,
  prompt: IncomingUserPrompt,
  parentId: number | null,
  {
    afterUserPromptSubmitted,
    afterResponseCreated,
    onStreamText,
    onCompleteTextStreaming,
    onFail,
    onCancel,
  }: PromptResponseEvents = {},
): Promise<ChatGenerationReturn> {
  const textStreamChannel = new Channel<StreamingResponseEvent>()

  textStreamChannel.onmessage = (ev) => {
    switch (ev.type) {
      case "userPrompt":
        afterUserPromptSubmitted?.(ev.id, new Date(ev.timestamp * 1000))
        break

      case "responseInfo":
        afterResponseCreated?.(ev.id)
        break

      case "text":
        onStreamText?.(ev.chunk)
        break

      case "done":
        onCompleteTextStreaming?.()
        break

      case "failure":
        onFail?.(ev.message)
        break

      case "canceled":
        onCancel?.(ev.message)
        break
    }
  }

  return await invoke<InternalChatGenerationReturn>("submit_user_prompt", {
    sessionId, prompt, onStream: textStreamChannel, parentId,
  })
    .then(({ id, dateCreated }) => ({
      id,
      dateCreated: new Date(dateCreated),
    }))
}
