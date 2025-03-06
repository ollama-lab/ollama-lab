import type { ImagePreview } from "$lib/models/images"
import { get, writable } from "svelte/store"

const internalImageCache = writable<{ [path: string]: { data: ImagePreview, timestamp: number } }>({})

export const imageCache = {
  subscribe: internalImageCache.subscribe,
  get(key: string) {
    return get(internalImageCache)[key]
  },
  add(key: string, value: ImagePreview) {
    internalImageCache.update(cache => {
      cache[key] = {
        data: value,
        timestamp: Date.now(),
      }

      return cache
    })
  },
  delete(key: string) {
    internalImageCache.update(item => {
      if (item[key]) {
        delete item[key]
      }
      return item
    })
  }
}
