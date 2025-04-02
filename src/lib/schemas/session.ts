import { z } from "zod";
import { nullIsUndefined } from "../utils/schemas/transforms";

export const sessionModeSchema = z.enum(["normal", "h2h"]).optional().default("normal");

export type SessionModeSchema = typeof sessionModeSchema;
export type SessionMode = z.infer<SessionModeSchema>;

export const sessionSchema = z.object({
  id: z.number().int(),
  profileId: z.number().int(),
  title: z.string().trim().nullish().transform(nullIsUndefined),
  dateCreated: z.coerce.date(),
  currentModel: z.string().trim(),
  mode: sessionModeSchema,
});

export type SessionSchema = typeof sessionSchema;
export type Session = z.infer<SessionSchema>;

export const roleSchema = z.enum(["system", "assistant", "user", "tool"]);

export type RoleSchema = typeof roleSchema;
export type Role = z.infer<RoleSchema>;

export const transmissionStatusSchema = z.enum(["preparing", "sending", "sent", "not sent"]);

export type TransmissionStatusSchema = typeof transmissionStatusSchema;
export type TransmissionStatus = z.infer<TransmissionStatusSchema>;

export const chatSchema = z.object({
  id: z.number().int(),
  sessionId: z.number().int(),
  role: roleSchema,
  content: z.string().trim(),
  imageCount: z.number().int().nonnegative(),
  dateSent: z.coerce.date().nullish().transform(nullIsUndefined),
  dateEdited: z.coerce.date().nullish().transform(nullIsUndefined),
  status: transmissionStatusSchema,
  agentId: z.number().int(),

  model: z.string().trim().nullish().transform(nullIsUndefined),

  versions: z.array(z.number().int()).nullish().transform(nullIsUndefined),

  thinking: z.boolean().nullish().transform(nullIsUndefined),
  thoughts: z.string().trim().nullish().transform(nullIsUndefined),
  thoughtFor: z.number().int().nonnegative().nullish().transform(nullIsUndefined),
});

export type ChatSchema = typeof chatSchema;
export type Chat = z.infer<ChatSchema>;

export const chatHistorySchema = z.object({
  chats: z.array(chatSchema),
});

export type ChatHistorySchema = typeof chatHistorySchema; 
export type ChatHistory = z.infer<ChatHistorySchema>;

export const sessionRenameReturnSchema = z.object({
  id: z.number().int(),
  title: z.string().nullable(),
}).nullable();

export type SessionRenameReturnSchema = typeof sessionRenameReturnSchema;
export type SessionRenameReturn = z.infer<SessionRenameReturnSchema>;

export const sessionCurrentModelReturnSchema = z.object({
  id: z.number().int(),
  currentModel: z.string().nullable(),
}).nullable();

export type SessionCurrentModelReturnSchema = typeof sessionCurrentModelReturnSchema;
export type SessionCurrentModelReturn = z.infer<SessionCurrentModelReturnSchema>;
