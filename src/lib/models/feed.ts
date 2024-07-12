import type { LLMKind } from "./llm"
import type { User } from "./user"

export type FeedStatus = "processing" | "generating" | "completed"

export type MultitypeSender = "system" | LLMKind | User

export interface Feed {
  status?: FeedStatus
  sender: MultitypeSender
  content: string
  date: Date
  isEdited?: boolean
}
