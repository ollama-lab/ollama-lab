import { PromptInput } from "../prompt-input";
import { ChatFeeds } from "./chat-feeds";
import { ChatPanelHeader } from "./header";

export function ChatPanel() {
  return (
    <div class="flex flex-col w-full h-full overflow-y-hidden">
      <ChatPanelHeader />

      <div class="grow px-4 py-2 w-full overflow-y-auto">
        <ChatFeeds />
      </div>

      <div class="max-w-5xl w-full mx-auto">
        <PromptInput />
      </div>
    </div>
  );
}
