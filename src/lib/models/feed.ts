export type FeedStatus = "processing" | "generating" | "completed"

export interface Feed {
  status: FeedStatus
  sender: string
  content: string
}
