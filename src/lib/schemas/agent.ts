import { z } from "zod";
import { nullIsEmptyString, nullIsUndefined } from "../utils/schemas/transforms";

export const agentSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().nullish().transform(nullIsUndefined),
  model: z.string().trim(),
  systemPrompt: z.string().trim().nullish().transform(nullIsUndefined),
  sessionId: z.number().int(),
  templateId: z.number().int().nullish().transform(nullIsUndefined),
  dateCreated: z.coerce.date(),
});

export type AgentSchema = typeof agentSchema;
export type Agent = z.infer<AgentSchema>;

export const agentUpdateSchema = z.object({
  name: z.string().trim().nullish().transform(nullIsEmptyString),
  model: z.string().trim().optional(),
  systemPrompt: z.string().trim().nullish().transform(nullIsEmptyString),
  sessionId: z.number().int().optional(),
  templateId: z.tuple([z.number().int().nullable()]).optional(),
  order: z.number().int().optional(),
});

export type AgentUpdateSchema = typeof agentUpdateSchema;
export type AgentUpdate = z.infer<AgentUpdateSchema>;

export const agentListItemSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  model: z.string(),
});

export type AgentListItemSchema = typeof agentListItemSchema;
export type AgentListItem = z.infer<AgentListItemSchema>;
