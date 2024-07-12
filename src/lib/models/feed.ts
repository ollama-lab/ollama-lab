import type { LLMKind } from "./llm"
import type { User } from "./user"

export type FeedStatus = "processing" | "generating" | "completed"

export interface Feed {
  status?: FeedStatus
  model?: LLMKind
  user?: User
  content: string
  date: Date
  isEdited?: boolean
}
