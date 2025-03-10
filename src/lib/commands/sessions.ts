import type { Session, SessionCurrentModelReturn, SessionRenameReturn } from "~/lib/models/session";
import { invoke } from "@tauri-apps/api/core";

interface InternalSession {
  id: number;
  profileId: number;
  title: string | null;
  dateCreated: string;
  currentModel: string;
  isH2h: boolean;
}

export async function listSessions(isH2h: boolean = false): Promise<Session[]> {
  return await invoke<InternalSession[]>("list_sessions", { isH2h }).then((sessions) =>
    sessions.map(
      (session) =>
        ({
          ...session,
          dateCreated: new Date(session.dateCreated),
        }) satisfies Session,
    ),
  );
}

export async function getSession(id: number): Promise<Session | null> {
  return await invoke<InternalSession>("get_session", { id }).then(
    (session) =>
      ({
        ...session,
        dateCreated: new Date(session.dateCreated),
      }) satisfies Session,
  );
}

export async function deleteSession(id: number): Promise<number | null> {
  return await invoke<number | null>("delete_session", { id });
}

export async function renameSession(id: number, newName: string | null): Promise<SessionRenameReturn> {
  return await invoke<SessionRenameReturn>("rename_session", { id, newName });
}

export async function setSessionModel(id: number, model: string): Promise<SessionCurrentModelReturn> {
  return await invoke<SessionCurrentModelReturn>("set_session_model", {
    id,
    model,
  });
}

export async function createSession(currentModel: string, title?: string | null, isH2h: boolean = false): Promise<Session> {
  return await invoke<InternalSession>("create_session", {
    currentModel,
    title,
    isH2h,
  }).then(
    (session) =>
      ({
        ...session,
        dateCreated: new Date(session.dateCreated),
      }) satisfies Session,
  );
}
