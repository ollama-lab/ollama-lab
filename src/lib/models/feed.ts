export type FeedStatus = "processing" | "generating" | "completed"

export type SenderRole = "system" | "user" | "assistant"

export interface Feed {
  id?: number
  status?: FeedStatus
  name: string
  role: string
  content: string
  date: Date
  isEdited?: boolean
}

export interface Bubble {
  id: number
  session: number
  role: string
  model: string | null
  content: string
  date_created: Date
  is_edited: boolean
}
