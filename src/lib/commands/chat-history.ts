import type { ChatBubble, Role } from "$lib/models/session"
import { invoke } from "@tauri-apps/api/core"

interface InternalChat {
  id: number
  sessionId: number
  role: string
  content: string
  completed: boolean
  dateCreated: string
  dateEdited: string | null
  model: string | null
  parentId: number | null
  versions: number[] | null
}

export async function getCurrentBranch(sessionId: number): Promise<ChatBubble[]> {
  return await invoke<InternalChat[]>("get_current_branch", { sessionId })
    .then(chats => chats.map(({ id, role, content, completed, dateCreated, dateEdited, model, versions }) => ({
      id,
      role: role as Role,
      content,
      status: completed ? "sent" : "not sent",
      dateSent: new Date(dateCreated),
      dateEdited: dateEdited !== null ? new Date(dateEdited) : undefined,
      model: model ?? undefined,
      versions,
    } satisfies ChatBubble)))
}

export async function switchBranch(targetChatId: number): Promise<ChatBubble[]> {
  return await invoke<InternalChat[]>("switch_branch", { targetChatId })
    .then(chats => chats.map(({ id, role, content, completed, dateCreated, dateEdited, model, versions }) => ({
      id,
      role: role as Role,
      content,
      status: completed ? "sent" : "not sent",
      dateSent: new Date(dateCreated),
      dateEdited: dateEdited !== null ? new Date(dateEdited) : undefined,
      model: model ?? undefined,
      versions,
    } satisfies ChatBubble)))
}
