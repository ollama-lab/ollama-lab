import { z } from "zod";

export const progressEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("inProgress"),
    id: z.string(),
    message: z.string(),
    total: z.number().nullable(),
    completed: z.number().nullable(),
  }),
  z.object({
    type: z.literal("success"),
    id: z.string(),
  }),
  z.object({
    type: z.enum(["failure", "canceled"]),
    id: z.string(),
    message: z.string().nullable(),
  }),
]);

export type ProgressEventSchema = typeof progressEventSchema;
export type ProgressEvent = z.infer<ProgressEventSchema>;
