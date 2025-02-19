import hljs from "highlight.js"
import MarkdownIt from "markdown-it"
import mdKatex from "@vscode/markdown-it-katex"
import "katex/dist/katex.min.css"

const md = MarkdownIt({
  html: false,
  linkify: true,
  highlight(src, lang) {
    const codeClass = lang ? `hljs language-${lang}` : "hljs"

    const langInfo = lang ? hljs.getLanguage(lang) : undefined

    const text = langInfo ? (
      hljs.highlight(src, {
        language: lang,
        ignoreIllegals: true,
      }).value
    ) : src

    return `<div class="codeblock">` +
        `<div class="header font-sans">` +
          `<span class="code-lang">${langInfo?.name ?? lang}</span>` +
          `<div class="toolbar">` +
          `</div>` +
        `</div>` +
        `<pre class="code-container"><code class="${codeClass}">${text}</code></pre>` +
      `</div>`
  },
})

md.use(mdKatex)

export function parseMarkdown(markdown: string): string {
  return md.render(markdown)
}
