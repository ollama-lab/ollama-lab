import { createEffect, createSignal } from "solid-js";
import { createMemo } from "solid-js";
import { preferredColorMode } from "./color-mode";
import { HighlighterCore } from "shiki";
import { createStore, reconcile } from "solid-js/store";

export const highlightTheme = createMemo(() => {
  return preferredColorMode() === "light" ? "one-light" : "tokyo-night";
});

const [highlighter, setHighlighter] = createSignal<HighlighterCore>();
const [displayNames, setDisplayNames] = createStore<Record<string, string>>({});

createEffect(() => {
  import("~/lib/highlight")
    .then((res) => {
      setHighlighter(res.highlighter)
      setDisplayNames(reconcile(res.displayNames));
    });
});

export function getDisplayNames() {
  return displayNames;
}

export { highlighter };
