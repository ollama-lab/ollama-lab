import { createContext, createEffect, createMemo, createSignal, JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { useSettings } from "~/lib/contexts/settings";
import { ColorMode } from "~/lib/models/settings";

interface ColorModeContextState {
  mode: ColorMode;
  setMode: (newMode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextState>({ mode: "system", setMode: () => {} });

export interface ColorModeProviderProps {
  children?: JSX.Element;
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const [mode, setMode] = createSignal<ColorMode>("system");

  createEffect(() => {
    if (isServer) {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("dark");

    if (mode() === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode());
    }
  });

  const settingsContext = useSettings();
  const settings = createMemo(() => settingsContext?.[0].settings);

  createEffect(() => {
    const colorMode = settings()?.appearance["color-mode"];
    if (colorMode) {
      setMode(colorMode);
    }
  });

  return (
    <ColorModeContext.Provider value={{ mode: mode(), setMode }}>
      {props.children}
    </ColorModeContext.Provider>
  );
}
