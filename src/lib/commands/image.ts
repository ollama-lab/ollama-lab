import type { ImagePreview } from "$lib/models/images"
import { imageCache } from "$lib/stores/images"
import { invoke } from "@tauri-apps/api/core"

export async function getCompressedImageBase64(path: string): Promise<ImagePreview> {
  return await invoke<ImagePreview>("get_compressed_image_base64", { path })
}

export async function getThumbnailBase64(path: string, cached: boolean = true): Promise<ImagePreview> {
  if (cached) {
    const data = imageCache.get(path) 
    if (data) {
      return data.data
    }
  }

  const result = await invoke<ImagePreview>("get_thumbnail_base64", { path })
  if (cached) {
    imageCache.add(path, result)
  }

  return result
}
