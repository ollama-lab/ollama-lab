import { ChevronDownIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/lib/components/ui/collapsible";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

export function SystemPromptBlock() {
  const chat = useChatEntry();

  const [open, setOpen] = createSignal(false);

  return (
    <Collapsible
      class="bg-muted text-muted-foreground rounded px-2 py-2 md:px-3"
      open={open()}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger class="text-sm font-bold w-full flex items-center">
        <span class="grow text-start">System prompt</span>
        <div>
          <ChevronDownIcon
            class={cn(
              "size-4 transition duration-200",
              open() && "-rotate-180",
            )}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent class="text-sm">
        <MarkdownBlock
          class="my-1 px-2 md:px-3 py-2 text-muted-foreground bg-muted/50 text-sm rounded"
          markdown={chat?.().content}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
