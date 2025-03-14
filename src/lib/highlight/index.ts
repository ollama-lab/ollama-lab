import { createHighlighterCore, createOnigurumaEngine } from "shiki";

export const highlighter = await createHighlighterCore({
  langs: [],
  themes: [
    import("@shikijs/themes/one-light"),
    import("@shikijs/themes/tokyo-night"),
  ],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});
