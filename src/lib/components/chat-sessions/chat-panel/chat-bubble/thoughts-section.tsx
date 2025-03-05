import { createSignal, Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";

export function ThoughtsSection() {
  const chat = useChatEntry();

  const [open, setOpen] = createSignal(false);

  return (
    <Show when={chat?.().thoughts || chat?.().thinking}>
      <div>
      </div>
    </Show>
  );
}
