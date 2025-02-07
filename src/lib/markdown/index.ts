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

const renderer = new marked.Renderer({
  silent: true,
  async: true,
  gfm: true,
})

renderer.code = ({ text, lang }) => {
  const codeClass = lang ? `hljs language-${lang}` : "hljs"

  return `
    <div class="codeblock">
      <div class="header">
        <span class="code-lang">${lang}</span>
        <div class="toolbar">
          <button class="copy"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
        </div>
      </div>
      <pre class="code-container"><code class="${codeClass}">${text}</code></pre>
    </div>
  `
}

export async function parseMarkdown(markdown: string): Promise<string> {
  return DOMPurify.sanitize(await marked.parse(markdown, { renderer }))
}
