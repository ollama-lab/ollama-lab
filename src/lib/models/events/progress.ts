export type ProgressEvent =
  | {
    type: "inProgress",
    id: string,
    message: string,
    total?: number,
    completed?: number,
  }
  | {
    event: "success",
    id: string,
  }
  | {
    event: "failure",
    id: string,
    message?: string,
  }
