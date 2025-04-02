import { z } from "zod";
import { nullIsUndefined } from "../utils/schemas/transforms";

export const agentTemplateSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().nullish().transform(nullIsUndefined),
  model: z.string().trim(),
  systemPrompt: z.string().trim().optional(),
  dateCreated: z.coerce.date(),
});

export type AgentTemplateSchema = typeof agentTemplateSchema;
export type AgentTemplate = z.infer<AgentTemplateSchema>;

export const agentTemplateCreationSchema = z.object({
  model: z.string().trim(),
});

export type AgentTemplateCreationSchema = typeof agentTemplateCreationSchema;
export type AgentTemplateCreation = z.infer<AgentTemplateCreationSchema>;

export const agentTemplateUpdateSchema = z.object({
  name: z.string().trim().optional(),
  model: z.string().trim().optional(),
  systemPrompt: z.string().trim().optional(),
});

export type AgentTemplateUpdateSchema = typeof agentTemplateUpdateSchema;
export type AgentTemplateUpdate = z.infer<AgentTemplateUpdateSchema>;
