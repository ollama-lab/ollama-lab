import { createMemo } from "solid-js";
import { preferredColorMode } from "./color-mode";

export const highlightTheme = createMemo(() => {
  return preferredColorMode() === "light" ? "one-light" : "tokyo-night";
});
