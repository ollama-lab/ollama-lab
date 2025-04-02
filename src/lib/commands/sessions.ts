import { sessionSchema, type Session, type SessionCurrentModelReturn, type SessionMode, type SessionRenameReturn } from "~/lib/schemas/session";
import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";

const sessionListSchema = z.array(sessionSchema);

export async function listSessions(mode: SessionMode): Promise<Session[]> {
  return await sessionListSchema.parseAsync(await invoke("list_sessions", { mode }));
}

const nullableSessionSchema = sessionSchema.nullable();

export async function getSession(id: number): Promise<Session | null> {
  return await nullableSessionSchema.parseAsync(await invoke("get_session", { id }));
}

export async function deleteSession(id: number): Promise<number | null> {
  return await invoke<number | null>("delete_session", { id });
}

export async function renameSession(id: number, newName: string | null): Promise<SessionRenameReturn> {
  return await invoke<SessionRenameReturn>("rename_session", { id, newName });
}

export async function setSessionModel(id: number, model: string): Promise<SessionCurrentModelReturn> {
  return await invoke<SessionCurrentModelReturn>("set_session_model", { id, model });
}

export async function createSession(mode: SessionMode, currentModel: string, title?: string | null): Promise<Session> {
  return await sessionSchema.parseAsync(await invoke("create_session", { currentModel, title, mode }));
}
