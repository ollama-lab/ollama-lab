import { z } from "zod";

export const imagePreviewSchema = z.object({
  path: z.string().trim(),
  mime: z.string().trim(),
  base64: z.string().base64(),
});

export type ImagePreviewSchema = typeof imagePreviewSchema;
export type ImagePreview = z.infer<ImagePreviewSchema>;

export const imageReturnSchema = z.object({
  id: z.number().int(),
  origin: z.string().nullable(),
  base64: z.string().base64(),
  mime: z.string(),
});

export type ImageReturnSchema = typeof imageReturnSchema;
export type ImageReturn = z.infer<ImageReturnSchema>;
