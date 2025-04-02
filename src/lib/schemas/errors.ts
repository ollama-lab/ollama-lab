import { z } from "zod";

export const commandErrorSchema = z.object({
  message: z.string(),
});

export type CommandErrorSchema = typeof commandErrorSchema;
export type CommandError = z.infer<CommandErrorSchema>;
