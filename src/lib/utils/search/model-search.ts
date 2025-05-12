import { invoke } from "@tauri-apps/api/core";
import { type SearchItem } from "~/lib/contexts/model-search-result";

/**
 * Search model
 *
 * This function crawls the HTML/HTMX chunk from Ollama's search page
 * and parses it using the browser's DOM.
 *
 * NOTE: This function returns a promise that returns a generator
 * rather than an async generator.
 *
 * @param keyword Search keyword
 * @returns A promise that returns a generator for search items
 *
 * @author Charles Dong
 * @since 0.1.0
 */
export async function searchModel(keyword: string): Promise<SearchItem[]> {
  return await invoke("search_model", { keyword });
}
