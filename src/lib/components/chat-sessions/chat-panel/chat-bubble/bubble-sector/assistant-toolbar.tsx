import { CopyIcon } from "lucide-solid";
import { Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { RegenDropdown } from "../regen-dropdown";
import { toast } from "solid-sonner";

export function AssistantBubbleSectorFooterToolbar() {
  const chat = useChatEntry();
  const content = () => chat?.().content;

  return (
    <div class="flex gap-2 items-center">
      <Show when={content?.()}>
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

      <RegenDropdown />
    </div>
  );
}
