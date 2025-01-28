export interface Session {
  id: number
  profileId: number
  title: string | null
  dateCreated: Date
  currentModel: string
}

export type Role = "system" | "assistant" | "user" | "tool"

export type TransmissionStatus = "preparing" | "sending" | "sent" | "not sent"

export interface ChatBubble {
  id: number
  role: Role
  content: string
  dateSent?: Date
  dateEdited?: Date
  status: TransmissionStatus 

  model?: string

  hasOtherVersions?: boolean
}

export interface ChatHistory {
  sessionId: number
  bubbles: ChatBubble[]
}

export type SessionRenameReturn = null | {
  id: number
  title: string | null
}

export type SessionCurrentModelReturn = null | {
  id: number
  currentModel: string | null
}
