import { writable } from "svelte/store"

export const BASE_DOMAIN = "ollama.com"
export const BASE_URL = `https://${BASE_DOMAIN}`

export type TagType = "category" | "parameter"

export interface Tag {
  type: TagType
  content: string
}

export interface SearchItem {
  name: string
  description?: string
  tags: Tag[]
  pulls: string
  tagCount: string
  updated: string
}

export type Category = "all" | "embedding" | "vision" | "tools"

export type OrderedBy = "popular" | "newest"

export interface SearchResult {
  keyword: string
  category: Category
  orderedBy: OrderedBy
  result: SearchItem[]
}

const internalSearchResult = writable<SearchResult | undefined>()

export const searchResult = {
  subscribe: internalSearchResult.subscribe,
  async search(keyword: string): Promise<void> {
  },
}
