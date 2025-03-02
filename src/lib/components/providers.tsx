import { JSX } from "solid-js";
import { ColorModeProvider } from "../contexts/color-mode";
import { SettingsProvider } from "../contexts/settings";
import { PullModelTasksProvider } from "../contexts/pull-model-tasks";
import { ChatSessionProvider } from "../contexts/chats";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <ColorModeProvider>
      <SettingsProvider>
        <PullModelTasksProvider>
          <ChatSessionProvider>{props.children}</ChatSessionProvider>
        </PullModelTasksProvider>
      </SettingsProvider>
    </ColorModeProvider>
  );
}
