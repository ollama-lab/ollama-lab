import { z } from "zod";
import { unixTimestampIntoDate } from "~/lib/utils/schemas/transforms";

const completionMetricsSchema = z.object({
  totalDuration: z.number().int().nonnegative().nullable(),
  loadDuration: z.number().int().nonnegative().nullable(),
  promptEvalCount: z.number().int().nonnegative().nullable(),
  promptEvalDuration: z.number().int().nonnegative().nullable(),
  evalCount: z.number().int().nonnegative().nullable(),
  evalDuration: z.number().int().nonnegative().nullable(),
});

export type CompletionMetrics = z.infer<typeof completionMetricsSchema>;

export const streamingResponseEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("userPrompt"),
    id: z.number().int(),
    timestamp: z.number().int().transform(unixTimestampIntoDate),
  }),
  z.object({
    type: z.literal("responseInfo"),
    id: z.number().int(),
  }),
  z.object({
    type: z.literal("systemPrompt"),
    id: z.number().int(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("text"),
    chunk: z.string(),
  }),
  z.object({
    type: z.literal("thoughtBegin"),
  }),
  z.object({
    type: z.literal("thoughtEnd"),
    thoughtFor: z.number().nullable(),
  }),
  z.object({
    type: z.literal("done"),
    ...completionMetricsSchema.shape,
  }),
  z.object({
    type: z.enum(["failure", "canceled"]),
    message: z.string().nullable(),
  }),
]);

export type StreamingResponseEventSchema = typeof streamingResponseEventSchema;
export type StreamingResponseEvent = z.infer<StreamingResponseEventSchema>;
