import { CopyIcon } from "lucide-solid";
import { Show } from "solid-js";
import { toast } from "solid-sonner";
import { useChatEntry } from "~/lib/contexts/chat-entry";

export function CopyButton() {
  const chat = useChatEntry();

  const content = () => chat?.().content;

  return (
    <Show when={content()}>
      {(c) => (
        <button
          title="Copy Markdown"
          onClick={() => {
            navigator.clipboard.writeText(c());
            toast.success("Successfully copied.");
          }}
        >
          <CopyIcon class="size-4" />
        </button>
      )}
    </Show>
  )
}
