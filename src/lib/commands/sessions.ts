import type { Session, SessionCurrentModelReturn, SessionRenameReturn } from "$lib/models/session"
import { invoke } from "@tauri-apps/api/core"

interface InternalSession {
  id: number
  profileId: number
  title: string | null
  dateCreated: string 
  currentModel: string
}

export async function listSessions(): Promise<Session[]> {
  return await invoke<InternalSession[]>("list_sessions")
    .then(sessions => sessions.map(({ id, profileId, title, dateCreated, currentModel }) => ({
      id,
      profileId,
      title,
      dateCreated: new Date(dateCreated),
      currentModel,
    } satisfies Session)))
}

export async function deleteSession(id: number): Promise<number | null> {
  return await invoke<number | null>("delete_session", { id })
}

export async function renameSession(id: number, newName: string | null): Promise<SessionRenameReturn> {
  return await invoke<SessionRenameReturn>("rename_session", { id, newName })
}

export async function setSessionModel(id: number, model: string): Promise<SessionCurrentModelReturn> {
  return await invoke<SessionCurrentModelReturn>("set_session_model", { id, model })
}
