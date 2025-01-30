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
    type: "thoughtBegin"
  }
  | {
    type: "thoughtEnd"
    thoughtFor: number | null
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
