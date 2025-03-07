import convert from "convert";
import { ChevronDownIcon } from "lucide-solid";
import { createMemo, createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { MarkdownBlock } from "~/lib/components/custom-ui/markdown-block";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "~/lib/components/ui/collapsible";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

function ThinkingHints() {
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

  const HintSpan = (props: { children?: JSX.Element }) => (
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
        <Switch fallback={(
          <HintSpan>Thought for {thoughtForString()}</HintSpan>
        )}>
          <Match when={thinking() && status() === "sending"}>
            <HintSpan>
              <LoaderSpin class="size-4 duration-500" />
              <span>Thinking...</span>
            </HintSpan>
          </Match>
        </Switch>
      </Presence>
    </div>
  );
}

export function ThoughtsSection() {
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
          <div class="flex items-center gap-2 text-sm text-muted-foreground relative z-20">
            <ThinkingHints />
            <CollapsibleTrigger title={open() ? "Collapse" : "Expand"}>
              <ChevronDownIcon class={cn("size-4 duration-300", open() && "-rotate-180")} />
            </CollapsibleTrigger>
          </div>

          <Presence exitBeforeEnter>
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
          </Presence>
        </Collapsible>
      </div>
    </Show>
  );
}
