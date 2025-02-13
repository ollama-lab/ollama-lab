export interface ChatGenerationReturn {
  id: number
  dateCreated: Date
}

export interface IncomingUserPrompt {
  text: string
  imagePath?: string[]
  useSystemPrompt?: boolean
}
