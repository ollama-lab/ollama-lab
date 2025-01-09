export interface ModelListItem {
  name: string
  modifiedAt: Date
  size: number
  digest: string
}

export interface ModelDetails {
  parentModel: string
  format: string
  family: string
  families: string[]
  parameterSize: string
  quantizationLevel: string
}

export interface Model {
  modelfile: string
  parameters: string
  template: string
  details: ModelDetails
  modelInfo: { [key: string]: any }
}
