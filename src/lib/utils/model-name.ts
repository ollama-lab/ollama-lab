export function completeModelName(modelName: string): string {
  return modelName.split(":").length < 2 ? `${modelName}:latest` : modelName;
}
