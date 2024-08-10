import type { User } from "./user"

export type FeedStatus = "processing" | "generating" | "completed"

export type SenderRole = "system" | "user" | "assistant"

export interface Feed {
  status?: FeedStatus
  model?: string
  user?: User
  content: string
  date: Date
  isEdited?: boolean
}
