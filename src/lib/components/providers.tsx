import { JSX } from "solid-js";
import { ColorModeProvider } from "../contexts/color-mode";
import { SettingsProvider } from "../contexts/settings";
import { PullModelTasksProvider } from "../contexts/pull-model-tasks";
import { ChatSessionsProvider } from "../contexts/chats";
import { ModelContextProvider } from "../contexts/model-list";
import { ChatHistoryProvider } from "../contexts/chats/chat-history";
import { SelectedSessionModelProvider } from "../contexts/model-list/selected-session-model";
import { ModelPageCurrentModelProvider } from "../contexts/model-page/current-model";

export default function Providers(props: { children?: JSX.Element }) {
  return (
    <ColorModeProvider>
      <SettingsProvider>
        <ModelContextProvider>
          <ChatSessionsProvider>
            <ChatHistoryProvider>
              <SelectedSessionModelProvider>
                <PullModelTasksProvider>
                  <ModelPageCurrentModelProvider>{props.children}</ModelPageCurrentModelProvider>
                </PullModelTasksProvider>
              </SelectedSessionModelProvider>
            </ChatHistoryProvider>
          </ChatSessionsProvider>
        </ModelContextProvider>
      </SettingsProvider>
    </ColorModeProvider>
  );
}
