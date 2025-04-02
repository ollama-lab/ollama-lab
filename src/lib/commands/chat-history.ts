import { chatSchema, type Chat } from "~/lib/schemas/session";
import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";

const chatArraySchema = z.array(chatSchema);

export async function getCurrentBranch(sessionId: number): Promise<Chat[]> {
  return chatArraySchema.parse(await invoke("get_current_branch", { sessionId }));
}

const tupleReturnSchema = z.tuple([
  z.number().int().nullable(),
  chatArraySchema,
]);

export async function switchBranch(targetChatId: number): Promise<[number | null, Chat[]]> {
  return tupleReturnSchema.parse(await invoke("switch_branch", { targetChatId }));
}
