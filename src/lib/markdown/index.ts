import DOMPurify from "isomorphic-dompurify"
import { marked } from "marked"
import hljs from "highlight.js"
import { markedHighlight } from "marked-highlight"
import markedKatex from "marked-katex-extension"

marked.use(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, _info) {
      return hljs.highlight(code, {
        language: hljs.getLanguage(lang)?.name ?? "plaintext",
        ignoreIllegals: true,
      }).value
    },
  }),
  markedKatex({
    throwOnError: false,
  }),
)

export async function parseMarkdown(markdown: string): Promise<string> {
  return DOMPurify.sanitize(await marked.parse(markdown, {
    silent: true,
    async: true,
    gfm: true,
  }))
}
