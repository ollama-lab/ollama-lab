export type TypeDetail =
  | {
    type: "enum",
    values: string[],
    default?: string,
    multiple?: boolean,
  }
  | {
    type: "string",
    default?: string,
  }
  | {
    type: "boolean",
    default?: boolean,
  }
  | {
    type: "number",
    min?: number,
    max?: number,
    default?: number,
  }

export const settingsSchema: { [key: string]: { [key: string]: TypeDetail } } = {
  appearance: {
    "color-mode": {
      type: "enum",
      values: ["system", "light", "dark"],
      default: "System",
    },
    //light: {
    //  type: "enum",
    //  values: ["Shadcn Zinc Light"],
    //  default: "Shadcn Zinc Light",
    //},
    //dark: {
    //  type: "enum",
    //  values: ["Shadcn Zinc Dark"],
    //  default: "Shadcn Zinc Dark",
    //},
  },
  ollama: {
    uri: {
      type: "string",
      default: "http://localhost:11434",
    },
  },
}
