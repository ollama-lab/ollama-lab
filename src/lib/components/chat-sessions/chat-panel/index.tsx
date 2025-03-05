import { PromptInput } from "../prompt-input";
import { ChatPanelHeader } from "./header";

export function ChatPanel() {
  return (
    <div class="flex flex-col w-full h-full">
      <ChatPanelHeader />

      <div class="max-w-5xl w-full mx-auto">
        <PromptInput />
      </div>
    </div>
  );
}
