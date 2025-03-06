import type { ImagePreview, ImageReturn } from "~/lib/models/images";
import { invoke } from "@tauri-apps/api/core";
import { CachedItem, getImageCache, setImageCache } from "../contexts/globals/image-cache";

export async function getCompressedImageBase64(path: string): Promise<ImagePreview> {
  return await invoke<ImagePreview>("get_compressed_image_base64", { path });
}

export async function getThumbnailBase64(path: string, cached: boolean = true): Promise<ImagePreview> {
  if (cached) {
    const data = getImageCache()[path] as CachedItem | undefined;
    if (data) {
      return data.data;
    }
  }

  const result = await invoke<ImagePreview>("get_thumbnail_base64", { path })
  if (cached) {
    setImageCache(path, {
      data: result,
      timestamp: Date.now(),
    });
  }

  return result;
}

export async function getImagesByChatId(chatId: number): Promise<ImageReturn[]> {
  return await invoke<ImageReturn[]>("get_images_by_chat_id", { chatId });
}
