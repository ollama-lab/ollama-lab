export interface Session {
  id: number
  title: string
}

export type Role = "system" | "assistant" | "user"

export type GenerationStatus = "processing" | "generating" | "done"

export interface ChatBubble {
  id: number
  role: Role
  content: string
  dateSent: Date
  dateEdited?: Date

  model?: string
  status?: GenerationStatus
}

export interface ChatHistory {
  sessionId: number
  bubbles: ChatBubble[]
}
