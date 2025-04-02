import { createStore } from "solid-js/store";
import { ImagePreview } from "~/lib/schemas/images";

export interface CachedItem {
  data: ImagePreview;
  timestamp: number;
}

export type ImageCache = Record<string, CachedItem>;

const [imageCache, setImageCache] = createStore<ImageCache>({});

export function clearImageCache() {
  setImageCache({});
}

export const getImageCache = () => imageCache;

export { setImageCache };
