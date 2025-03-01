import { JSX } from "solid-js/jsx-runtime";
import "./app.css";
import "@fontsource-variable/inter/wght.css";
import { AppBar } from "./lib/components/app-bar";
import { children } from "solid-js";
import { SettingsProvider } from "./lib/contexts/settings";
import { ColorModeProvider } from "./lib/components/color-mode/provider";

export function Layout(props: { children?: JSX.Element }) {
  const childrenComp = children(() => props.children);

  return (
    <SettingsProvider>
      {/* Must behind settings provider */}
      <ColorModeProvider>
        <div class="flex flex-row w-dvw h-dvh">
          <AppBar />

          <div class="grow">{childrenComp()}</div>
        </div>
      </ColorModeProvider>
    </SettingsProvider>
  );
}
