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
  modelfile: string
  parameters: string
  template: string
  details: ModelDetails
  model_info: { [key: string]: any }
}
