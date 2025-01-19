import { BASE_URL, type SearchItem } from "$lib/stores/model-search"
import { fetch } from "@tauri-apps/plugin-http"
import DOMPurify from "isomorphic-dompurify"

/**
 * Search model
 *
 * @author Charles Dong
 * @since 0.1.0
 */
export async function searchModel(keyword: string): Promise<SearchItem[]> {
  const res = await fetch(`${BASE_URL}/search?` + new URLSearchParams({ q: keyword }))
  if (res.ok) {
    throw new Error(`Fetching error: ${res.status}`)
  }

  DOMPurify.sanitize(await res.text())
  // TODO: Implement model search
}
