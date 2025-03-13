import { createMemo } from "solid-js";
import { preferredColorMode } from "./color-mode";
import { HighlighterCore } from "shiki";
import { createAsync, createAsyncStore } from "@solidjs/router";

export const highlightTheme = createMemo(() => {
  return preferredColorMode() === "light" ? "one-light" : "tokyo-night";
});

const highlighter = createAsync<HighlighterCore>(async () => (await import("~/lib/highlight")).highlighter);
const displayNames = createAsyncStore(async () => (await import("~/lib/highlight")).displayNames);

export { highlighter, displayNames };
