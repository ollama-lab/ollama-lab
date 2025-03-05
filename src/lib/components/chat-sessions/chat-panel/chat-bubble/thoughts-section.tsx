import convert from "convert";
import { ChevronDownIcon } from "lucide-solid";
import { createMemo, createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Motion, Presence } from "solid-motionone";
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
      transition={{ duration: 150 }}
      initial={{ x: -35, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 35, opacity: 0 }}
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
            <HintSpan><LoaderSpin text="Thinking..." /></HintSpan>
          </Match>
        </Switch>
      </Presence>
    </div>
  );
}

export function ThoughtsSection() {
  const chat = useChatEntry();

  const [open, setOpen] = createSignal(false);

  return (
    <Show when={chat?.().thoughts || chat?.().thinking}>
      <div>
        <Collapsible open={open()} onOpenChange={setOpen}>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <ThinkingHints />
            <CollapsibleTrigger title={open() ? "Collapse" : "Expand"}>
              <ChevronDownIcon class={cn("size-4 duration-300", open() && "-rotate-180")} />
            </CollapsibleTrigger>
          </div>

          <Presence>
            <CollapsibleContent as={Motion.div}>
              <div></div>
            </CollapsibleContent>
          </Presence>
        </Collapsible>
      </div>
    </Show>
  );
}
