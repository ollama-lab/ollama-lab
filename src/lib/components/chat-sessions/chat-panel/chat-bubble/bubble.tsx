import { Show, createMemo } from "solid-js";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

export function Bubble() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const content = createMemo(() => chat?.().content);
  const status = () => chat?.().status;

  return (
    <div class={cn(
      "py-2",
      role() === "user" && "bg-secondary text-secondary-foreground px-5 rounded-2xl",
    )}>
      <MarkdownBlock markdown={content()} />
      <Show when={status() === "preparing"}>
        <LoaderSpin />
      </Show>
    </div>
  );
}
