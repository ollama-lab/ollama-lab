/**
 * Convert input string to format that is safe to be used
 * for event names.
 *
 * @param input Input string
 * @returns Compatible format
 */
export function toEventString(input: string): string {
  return input.replaceAll(/[^\d\w-/:_]/, "_")
}
