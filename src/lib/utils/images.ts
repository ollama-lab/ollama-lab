export function toSrcString(mime: string, base64: string) {
  return `data:${mime};base64,${base64}`;
}
