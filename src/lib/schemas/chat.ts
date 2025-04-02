import { z } from "zod";

export const chatGenerationReturnSchema = z.object({
  id: z.number().int(),
  dateCreated: z.coerce.date(),
});

export type ChatGenerationReturnSchema = typeof chatGenerationReturnSchema;
export type ChatGenerationReturn = z.infer<ChatGenerationReturnSchema>;

export const incomingUserPromptSchema = z.object({
  text: z.string().trim(),
  imagePaths: z.array(z.string().trim()).optional(),
  useSystemPrompt: z.boolean().optional().default(false),
});

export type IncomingUserPromptSchema = typeof incomingUserPromptSchema;
export type IncomingUserPrompt = z.infer<IncomingUserPromptSchema>;

export const editUserPrompt = z.object({
  text: z.string().trim().optional(),
  imagePaths: z.array(z.string().trim()).optional(),
  useSystemPrompt: z.boolean().optional(),
});

export type EditUserPromptSchema = typeof editUserPrompt;
export type EditUserPrompt = z.infer<EditUserPromptSchema>;
