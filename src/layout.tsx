import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { SettingsProvider } from "./lib/contexts/settings";
import { ColorModeProvider } from "./lib/contexts/color-mode";

export function Layout(props: { children?: JSX.Element }) {

  return (
    <>
      <ColorModeProvider>
        <SettingsProvider>
          <div class="flex flex-row w-dvw h-dvh">
            <AppBar />

            <div class="grow">{props.children}</div>
          </div>
        </SettingsProvider>
      </ColorModeProvider>
    </>
  );
}
