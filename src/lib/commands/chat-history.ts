import type { Chat, Role } from "~/lib/models/session";
import { invoke } from "@tauri-apps/api/core";

interface InternalChat {
  id: number;
  sessionId: number;
  role: Role;
  content: string;
  imageCount: number | null;
  completed: boolean;
  dateCreated: string;
  dateEdited: string | null;
  model: string | null;
  parentId: number | null;
  versions: number[] | null;
  agentId: number | null;

  thoughts: string | null;
  thoughtFor: number | null;
}

export async function getCurrentBranch(sessionId: number): Promise<Chat[]> {
  return await invoke<InternalChat[]>("get_current_branch", { sessionId }).then((chats) =>
    chats.map(
      (item) =>
        ({
          ...item,
          role: item.role,
          imageCount: item.imageCount ?? 0,
          status: item.completed ? "sent" : "not sent",
          dateSent: new Date(item.dateCreated),
          dateEdited: item.dateEdited !== null ? new Date(item.dateEdited) : undefined,
          model: item.model ?? undefined,
          agentId: item.agentId ?? undefined,
        }) satisfies Chat,
    ),
  );
}

export async function switchBranch(targetChatId: number): Promise<[number | null, Chat[]]> {
  return await invoke<[number | null, InternalChat[]]>("switch_branch", {
    targetChatId,
  }).then(([parentId, chats]) => [
    parentId,
    chats.map(
      (item) =>
        ({
          ...item,
          role: item.role,
          imageCount: item.imageCount ?? 0,
          status: item.completed ? "sent" : "not sent",
          dateSent: new Date(item.dateCreated),
          dateEdited: item.dateEdited !== null ? new Date(item.dateEdited) : undefined,
          model: item.model ?? undefined,
          agentId: item.agentId ?? undefined,
        }) satisfies Chat,
    ),
  ]);
}
