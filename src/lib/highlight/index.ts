import { createHighlighterCore, createOnigurumaEngine } from "shiki";
import { langs } from "./langs";

export const highlighter = await createHighlighterCore({
  langs,
  themes: [
    import("@shikijs/themes/one-light"),
    import("@shikijs/themes/tokyo-night"),
  ],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

export const displayNames = await Promise.all(langs)
  .then((res) => res
  .reduce((acc, cur) => {
    const item = cur.default[0];

    for (const ft of [item.name, ...item.fileTypes ?? []]) {
      if (item.displayName) {
        acc[ft] = item.displayName;
      }
    }

    return acc;
  }, {} as Record<string, string>));
