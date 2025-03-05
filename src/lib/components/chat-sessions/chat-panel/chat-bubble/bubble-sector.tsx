import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";

export function BubbleSector() {
  const chat = useChatEntry();

  const role = createMemo(() => chat?.().role);

  const [editMode, setEditMode] = createSignal(false);

  return (
    <Switch>
      <Match when={role() === "user" || role() === "assistant"}>
        <div
          class={cn(
            "group/bubble-sector flex py-1 gap-2 items-center",
            role() === "user" ? "place-content-end" : "place-content-start",
          )}
        >
          <div class="flex flex-col w-full">
            <div class="flex gap-2 w-full">
              <Show when={role() === "assistant"}>
                
              </Show>

            </div>
          </div>
        </div>
      </Match>
      <Match when={role() === "system"}>
      </Match>
    </Switch>
  );
}
