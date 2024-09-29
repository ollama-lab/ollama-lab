export interface ModelDetails {
  parent_model?: string
  format: string
  family: string
  families: string[] | null
  parameter_size: string
  quantization_level: string
}

export interface Model {
  name: string
  modified_at: Date
  size: number
  digest: string
  details: ModelDetails
}

export interface RunningStatus {
  expires_at: Date
  size_vram: number
}

export type RunningModel = {
  name: string
  model: string
  size: number
  digest: string
  details: ModelDetails
} & RunningStatus

export interface ModelInfo {
  modelfile: string
  parameters: string
  template: string
  details: ModelDetails
  model_info: { [key: string]: string | number | [] | null | undefined }
}
