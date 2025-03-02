import { JSX } from "solid-js";
import { ColorModeProvider } from "../contexts/color-mode";
import { SettingsProvider } from "../contexts/settings";
import { PullModelTasksProvider } from "../contexts/pull-model-tasks";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <ColorModeProvider>
      <SettingsProvider>
        <PullModelTasksProvider>
          {props.children}
        </PullModelTasksProvider>
      </SettingsProvider>
    </ColorModeProvider>
  );
}
