import type { ChatGenerationReturn, IncomingUserPrompt } from "$lib/models/chat"
import type { StreamingResponseEvent } from "$lib/models/events/text-streams"
import { invoke, type Channel } from "@tauri-apps/api/core"

interface InternalChatGenerationReturn {
  id: number
  dateCreated: string
}

export async function submitUserPrompt(
  sessionId: number,
  prompt: IncomingUserPrompt,
  onStream: Channel<StreamingResponseEvent>,
): Promise<ChatGenerationReturn> {
  return await invoke<InternalChatGenerationReturn>("submit_user_prompt", { sessionId, prompt, onStream })
    .then(({ id, dateCreated }) => ({
      id,
      dateCreated: new Date(dateCreated),
    }))
}
