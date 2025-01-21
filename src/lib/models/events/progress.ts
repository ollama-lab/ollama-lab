export type ProgressEvent =
  | {
    type: "inProgress",
    id: string,
    message: string,
    total?: number,
    completed?: number,
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
