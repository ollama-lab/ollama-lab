import convert from "convert";
import { ChevronDownIcon } from "lucide-solid";
import { createMemo, createSignal, Component, JSX, Show } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "~/lib/components/ui/collapsible";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

const ThinkingHints: Component = () => {
  const chat = useChatEntry();

  const thinking = () => chat?.().thinking;
  const status = () => chat?.().status;

  const thoughtForString = createMemo(() => {
    const thoughtFor = chat?.().thoughtFor;
    if (thoughtFor) {
      const precision = thoughtFor <= 1000 ? 0 : thoughtFor < 60_000 ? 3 : 2;
      return convert(thoughtFor, "milliseconds").to("best").toString(precision);
    }

    return "some time";
  });

  const HintSpan: Component<{ children?: JSX.Element }> = (props) => (
    <Motion.span
      transition={{ duration: 0.15 }}
      initial={{ x: -35, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 35, opacity: 0 }}
      class="flex gap-2 items-center relative -z-[1]"
    >
      {props.children}
    </Motion.span>
  );

  return (
    <div class="flex items-center gap-2 text-sm text-muted-foreground">
      <Presence exitBeforeEnter>
        <Show
          when={thinking() && status() === "sending"}
          fallback={(
            <HintSpan>Reasoning complete in {thoughtForString()}</HintSpan>
          )}
        >
          <HintSpan>
            <LoaderSpin class="size-4 duration-500" />
            <span>Reasoning...</span>
          </HintSpan>
        </Show>
      </Presence>
    </div>
  );
}

export const ThoughtsSection: Component = () => {
  const chat = useChatEntry();

  const [open, setOpen] = createSignal(false);

  const hasThoughts = createMemo(() => {
    const thoughts = chat?.().thoughts;
    return thoughts && thoughts.trim().length > 0;
  });

  return (
    <Show when={hasThoughts()}>
      <div>
        <Collapsible open={open()} onOpenChange={setOpen}>
          <div class="sticky -top-2 flex z-20">
            <div class="flex items-center gap-2 text-sm text-muted-foreground bg-background z-20 px-1.5 py-1 rounded">
              <ThinkingHints />
              <CollapsibleTrigger title={open() ? "Collapse" : "Expand"}>
                <ChevronDownIcon class={cn("size-4 duration-300", open() && "-rotate-180")} />
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent
            as={Motion.div}
            transition={{ duration: 0.3 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            class="bg-muted text-muted-foreground text-sm px-4 py-2.5 rounded"
          >
            <MarkdownBlock markdown={chat?.().thoughts ?? undefined} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Show>
  );
}
