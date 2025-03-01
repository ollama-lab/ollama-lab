export interface ModelListItem {
  name: string
  modified_at: Date
  size: number
}

export interface ModelDetails {
  parent_model: string
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}

export interface Model {
  name: string
  modified_at: Date
  size: number
  details: ModelDetails
}

export interface ModelInfo {
  modelfile?: string
  parameters?: string
  template?: string
  details?: ModelDetails
  model_info?: { [key: string]: any }
}

export interface RunningModel {
  name: string
  expires_at: Date
  size_vram: number
}
