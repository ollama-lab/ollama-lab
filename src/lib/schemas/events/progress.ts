import { z } from "zod";
import { nullIsUndefined } from "~/lib/utils/schemas/transforms";

export const progressEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("inProgress"),
    id: z.string(),
    message: z.string(),
    total: z.number().nullish().transform(nullIsUndefined),
    completed: z.number().nullish().transform(nullIsUndefined),
  }),
  z.object({
    type: z.literal("success"),
    id: z.string(),
  }),
  z.object({
    type: z.enum(["failure", "canceled"]),
    id: z.string(),
    message: z.string().nullish().transform(nullIsUndefined),
  }),
]);

export type ProgressEventSchema = typeof progressEventSchema;
export type ProgressEvent = z.infer<ProgressEventSchema>;
