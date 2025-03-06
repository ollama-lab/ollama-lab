import { createMemo, Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { BubbleSectorFooterStatus } from "./bubble-sector/status";
import { AssistantBubbleSectorFooterToolbar } from "./bubble-sector/assistant-toolbar";

export function SectorFooter() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const status = () => chat?.().status;

  const isCompleted = createMemo(() => {
    const c = chat?.();
    if (!c) {
      return undefined;
    }

    return c.status === "sent" || c.status === "not sent";
  });

  return (
    <div class="flex items-center gap-2 text-xs text-muted-foreground">
      <Show when={role?.() === "assistant"}>
        <Show when={status?.() !== "sent"}>
          <BubbleSectorFooterStatus />
        </Show>

        <Show when={isCompleted()}>
          <AssistantBubbleSectorFooterToolbar />
        </Show>
      </Show>
    </div>
  );
}
