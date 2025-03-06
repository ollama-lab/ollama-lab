import { createStore } from "solid-js/store";
import { ColorMode } from "../../models/settings";
import { createEffect } from "solid-js";

export type DisplayColorMode = "light" | "dark";

interface ColorModeStore {
  colorMode: ColorMode;
  preferredColorMode: DisplayColorMode;
}

const [colorModeStore, setColorModeStore] = createStore<ColorModeStore>({
  colorMode: "system",
  preferredColorMode: "dark",
});

createEffect(() => {
  const root = window.document.body;

  let preferredMode = colorModeStore.colorMode;
  if (preferredMode === "system") {
    preferredMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  setColorModeStore("preferredColorMode", preferredMode);

  if (preferredMode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
});

export function setColorMode(mode: ColorMode) {
  setColorModeStore("colorMode", mode);
}

export function colorMode() {
  return colorModeStore.colorMode;
}

export function preferredColorMode() {
  return colorModeStore.preferredColorMode;
}
