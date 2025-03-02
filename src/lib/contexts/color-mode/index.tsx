import { Accessor, createContext, createEffect, JSX, Setter, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import type { ColorMode as ColorModeModel } from "~/lib/models/settings";

interface ColorModeContextModel {
  colorMode: Accessor<ColorModeModel>;
  preferredColorMode: Accessor<"light" | "dark">;
  setColorMode: Setter<ColorModeModel>;
}

const ColorModeContext = createContext<ColorModeContextModel>();

interface ColorModeStore {
  colorMode: ColorModeModel;
  preferredColorMode: "light" | "dark";
}

export interface ColorModeProviderProps {
  children?: JSX.Element;
}

export function ColorModeProvider(props: ColorModeProviderProps) {
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

  const colorMode = () => colorModeStore.colorMode;
  const preferredColorMode = () => colorModeStore.preferredColorMode;

  return (
    <ColorModeContext.Provider value={{
      colorMode,
      preferredColorMode,
      setColorMode: (value) => setColorModeStore("colorMode", value),
    }}>
    {props.children}
  </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
