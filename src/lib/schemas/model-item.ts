import { z } from "zod";
import { nullIsUndefined } from "../utils/schemas/transforms";

export const modelDetailsSchema = z.object({
  parent_model: z.string(),
  format: z.string(),
  family: z.string(),
  families: z.array(z.string()).nullable(),
  parameter_size: z.string(),
  quantization_level: z.string(),
});

export type ModelDetailsSchema = typeof modelDetailsSchema;
export type ModelDetails = z.infer<ModelDetailsSchema>;

export const modelListItemSchema = z.object({
  name: z.string(),
  modified_at: z.coerce.date(),
  size: z.number().int(),
  digest: z.string(),
  details: modelDetailsSchema,
});

export type ModelListItemSchema = typeof modelListItemSchema;
export type ModelListItem = z.infer<ModelListItemSchema>;

export const modelSchema = z.object({
  name: z.string(),
  modified_at: z.coerce.date(),
  size: z.number(),
  details: modelDetailsSchema,
});

export type ModelSchema = typeof modelSchema;
export type Model = z.infer<ModelSchema>;

export const modelInfoSchema = z.object({
  modelfile: z.string().nullish().transform(nullIsUndefined),
  parameters: z.string().nullish().transform(nullIsUndefined),
  template: z.string().nullish().transform(nullIsUndefined),
  details: modelDetailsSchema,
  model_info: z.record(z.unknown()).nullish().transform(nullIsUndefined),
});

export type ModelInfoSchema = typeof modelInfoSchema;
export type ModelInfo = z.infer<ModelInfoSchema>;

export const runningModelSchema = z.object({
  name: z.string(),
  size: z.number(),
  details: modelDetailsSchema,
  expires_at: z.coerce.date(),
  size_vram: z.number().int(),
});

export type RunningModelSchema = typeof runningModelSchema;
export type RunningModel = z.infer<RunningModelSchema>;
