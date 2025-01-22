export type ProgressEvent =
  | {
    type: "inProgress",
    id: string,
    message: string,
    total?: number | null,
    completed?: number | null,
  }
  | {
    type: "success",
    id: string,
  }
  | {
    type: "failure",
    id: string,
    message?: string,
  }
