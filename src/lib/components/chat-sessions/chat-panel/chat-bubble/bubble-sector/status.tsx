import { Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";

export function BubbleSectorFooterStatus() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const status = () => chat?.().status;

  const text: Record<string, Record<string, string>> = {
    user: {
      sent: "sent",
      "not sent": "failed",
    },
    assistant: {
      preparing: "initializing",
      sending: "generating",
      sent: "generated",
      "not sent": "not completed",
    },
  }

  return (
    <div class="flex gap-1 items-center">
      <span class="uppercase font-light">
        <Show when={role()}>
          {(r) => (
            <Show when={status()}>
              {(s) => (
                <span>{text[r()]?.[s()]}</span>
              )}
            </Show>
          )}
        </Show>
      </span>
    </div>
  );
}
