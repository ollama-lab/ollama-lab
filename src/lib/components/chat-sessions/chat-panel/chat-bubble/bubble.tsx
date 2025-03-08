import { Show, createMemo } from "solid-js";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { Progress } from "~/lib/components/ui/progress";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

export function Bubble() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const content = createMemo(() => chat?.().content);
  const status = () => chat?.().status;

  const isNotEmpty = createMemo(() => {
    const text = content();
    return text && text.length > 1;
  });

  return (
    <Show when={isNotEmpty() || status() === "sent"}>
      <div class={cn(
        "py-2",
        role() === "user" && "bg-secondary text-secondary-foreground px-5 rounded-2xl",
      )}>
        <MarkdownBlock markdown={content()} />
        <Show when={status() === "preparing"}>
          <Progress
            value={null}
            class="w-full max-w-md"
          />
        </Show>
      </div>
    </Show>
  );
}
