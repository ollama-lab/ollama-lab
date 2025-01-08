export interface Session {
  id: number
  title: string
  dateCreated: Date
}

export type Role = "system" | "assistant" | "user"

export type TransmissionStatus = "preparing" | "sending" | "sent" | "not sent"

export interface ChatBubble {
  id: number
  role: Role
  content: string
  dateSent?: Date
  dateEdited?: Date
  status: TransmissionStatus 

  model?: string
}

export interface ChatHistory {
  sessionId: number
  bubbles: ChatBubble[]
}
