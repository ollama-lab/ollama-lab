import { createSignal } from "solid-js";
import { ChatPanelHeader } from "./header";

export function ChatPanel() {
  const [scrolledToBottom, setScrolledToBottom] = createSignal(true);

  return (
    <div class="flex flex-col w-full h-full">
      <ChatPanelHeader />
    </div>
  );
}
