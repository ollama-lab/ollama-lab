export type StreamingResponseEvent =
  | {
    type: "userPrompt"
    id: number
    timestamp: number
  }
  | {
    type: "responseInfo"
    id: number
  }
  | {
    type: "text"
    chunk: string
  }
  | {
    type: "done"
  }
  | {
    type: "failure"
    message: string | null
  }
  | {
    type: "canceled"
    message: string | null
  }
