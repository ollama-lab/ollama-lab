import DOMPurify from "dompurify"
import { marked } from "marked"
import markedKatex from "marked-katex-extension"

marked.use(
  {
    gfm: true,
  }, 
  markedKatex({
    throwOnError: false,
  }),
)

/**
 * Parse Markdown to sanitized HTML (sync)
 */
export function parseMarkdown(markdown: string): string {
  return DOMPurify.sanitize(marked.parse(markdown, { async: false }) as string)
}
