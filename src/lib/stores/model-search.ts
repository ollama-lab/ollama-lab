import { writable } from "svelte/store"
import { z } from "zod"

export const BASE_DOMAIN = "ollama.com"
export const BASE_URL = `https://${BASE_DOMAIN}`

export const searchEntrySchema = z.object({
  q: z.string().trim(),
  c: z.enum(["all", "embedding", "vision", "tools"]).default("all"),
  o: z.enum(["popular", "newest"]).default("popular"),
})

export type SearchEntrySchema = typeof searchEntrySchema

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

export type Category = typeof searchEntrySchema._type.c

export type OrderedBy = typeof searchEntrySchema._type.o

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
