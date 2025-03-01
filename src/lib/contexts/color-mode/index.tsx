import { createContext, createEffect, createSignal, JSX, Setter, useContext } from "solid-js";
import { isServer } from "solid-js/web";
import type { ColorMode as ColorModeModel } from "~/lib/models/settings";

const ColorModeContext = createContext<[ColorModeModel, Setter<ColorModeModel>]>(["system", () => {}]);

export interface ColorModeProviderProps {
  children?: JSX.Element;
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const [colorMode, setColorMode] = createSignal<ColorModeModel>("system");

  createEffect(() => {
    if (isServer) {
      return;
    }

    const root = window.document.body;

    let preferredMode = colorMode();
    if (preferredMode === "system") {
      preferredMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    }

    if (preferredMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });

  return (
    <ColorModeContext.Provider value={[colorMode(), setColorMode]}>
      {props.children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
