import type { ImagePreview } from "$lib/models/images"
import { invoke } from "@tauri-apps/api/core"
import { get, writable } from "svelte/store"

const CACHE_SIZE = 10
const imageCache = writable<{ [path: string]: { data: ImagePreview, timestamp: number } }>({})

export async function getCompressedImageBase64(path: string): Promise<ImagePreview> {
  return await invoke<ImagePreview>("get_compressed_image_base64", { path })
}

export async function getThumbnailBase64(path: string, cached: boolean = true): Promise<ImagePreview> {
  if (cached) {
    const data = get(imageCache)[path]
    if (data) {
      return data.data
    }
  }

  const result = await invoke<ImagePreview>("get_thumbnail_base64", { path })
  if (cached) {
    imageCache.update(cache => {
      cache[path] = {
        data: result,
        timestamp: Date.now(),
      }

      if (Object.keys(cache).length > CACHE_SIZE) {
        let oldestTimestamp = Infinity
        let oldest: string | undefined = undefined

        for (const [key, value] of Object.entries(cache)) {
          if (value.timestamp < oldestTimestamp) {
            oldestTimestamp = value.timestamp
            oldest = key
          }
        }

        if (oldest) {
          delete cache[oldest]
        }
      }
      return cache
    })
  }

  return result
}
