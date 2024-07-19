import type { User } from "./user"

export type FeedStatus = "processing" | "generating" | "completed"

export interface Feed {
  status?: FeedStatus
  model?: string
  user?: User
  content: string
  date: Date
  isEdited?: boolean
}
