# AGENTS.md

## Non-obvious learnings

- In `shiki` integration, custom grammars registered in `createHighlighter({ langs: [...] })` should be passed as language objects, not `() => import(...)` loaders from local files; loader functions are for bundled/external language sources and custom langs can silently fall back to `text`.
- Do not call `highlighter.loadLanguage()` for custom language IDs that are already pre-registered (for example `chatml`, `modelfile`, `go-template`); Shiki may throw "not included in this bundle" and downstream code falls back to plain text.
- If code blocks render from `codeToHast()` via a custom line-tree (`src/lib/components/custom-ui/code-block/index.tsx`), preserve `<pre>` style metadata (at least `background-color`) from Shiki output; otherwise theme background disappears even when token colors render.
- In custom Shiki language definitions, avoid aliases that equal `name` (for example `name: "chatml"` with `aliases: ["chatml"]`), which triggers a circular alias error at runtime.
