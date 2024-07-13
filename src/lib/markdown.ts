import DOMPurify from "dompurify"
import { marked } from "marked"
import markedKatex from "marked-katex-extension"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

marked.use(
  {
    gfm: true,
  }, 
  markedKatex({
    throwOnError: false,
  }),
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, _info) {
      return hljs.highlight(
        code,
        {
          language: hljs.getLanguage(lang) ? lang : "plaintext",
        },
      ).value
    },
  }),
)

/**
 * Parse Markdown to sanitized HTML (sync)
 */
export function parseMarkdown(markdown: string): string {
  return DOMPurify.sanitize(marked.parse(markdown, { async: false }) as string)
}

/**
 * Parse Markdown to sanitized HTML (async)
 */
export async function parseMarkdownAsync(markdown: string): Promise<string> {
  return DOMPurify.sanitize(await (marked.parse(markdown, { async: true }) as Promise<string>))
}
