import { createEffect, createSignal, For, Index, Match, Switch } from "solid-js";
import { ChatEntryProvider } from "~/lib/contexts/chat-entry";
import { getChatHistory } from "~/lib/contexts/globals/chat-history";
import { cn } from "~/lib/utils/class-names";
import { BubbleSector } from "./chat-bubble/bubble-sector";
import { getSessionWiseModel, setSessionWiseModel } from "~/lib/contexts/globals/session-wise-model";
import { defaultModel, modelList } from "~/lib/contexts/globals/model-states";

function Hints() {
  const keyHints: Record<string, string> = {
    "Enter": "Send prompt",
    "Shift + Enter": "New line",
  };

  return (
    <div class="hint-table grid grid-cols-2 gap-x-2 gap-y-1 items-center">
      <For each={Object.entries(keyHints)}>
        {([key, desc]) => (
          <>
            <div class="text-end">
              <For each={key.split(" ")}>
                {(key) => (
                  <Switch fallback={key}>
                    <Match when={key !== "+" && key !== "/"}>
                      <kbd>{key}</kbd>
                    </Match>
                  </Switch>
                )}
              </For>
            </div>
            <div class="text-start">{desc}</div>
          </>
        )}
      </For>
    </div>
  );
}

function WelcomeText() {
  return (
    <div class="text-center flex flex-col gap-3.5">
      <span class="select-none font-bold text-2xl">Hello there! 👋</span>
      <Hints />
    </div>
  );
}

export function ChatFeeds() {
  const [rootRef, setRootRef] = createSignal<HTMLDivElement>();

  const [autoScroll, setAutoScroll] = createSignal(true);

  createEffect(() => {
    if (getSessionWiseModel()) {
      return;
    }

    const fallback = defaultModel() ?? modelList().at(0)?.name;
    if (fallback) {
      setSessionWiseModel(fallback);
    }
  });

  createEffect(() => {
    const status = getChatHistory()?.chats.at(-1)?.status;

    if (status === "preparing" || status === "sending") {
      const root = rootRef();
      if (root && autoScroll()) {
        root.parentElement?.scrollTo(0, root.scrollHeight);
      }
    }
  });

  return (
    <div
      ref={setRootRef}
      class={cn(
        "flex flex-col flex-wrap text-wrap max-w-5xl mx-auto",
        !getChatHistory() && "h-full place-content-center items-center",
      )}
      onWheel={(ev) => {
        if (ev.deltaY < 0) {
          setAutoScroll(false);
        } else {
          const scrollArea = ev.currentTarget.parentElement;
          if (scrollArea) {
            if (ev.currentTarget.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <= 0) {
              setAutoScroll(true);
            }
          }
        }
      }}
    >
      <Index each={getChatHistory()?.chats} fallback={<WelcomeText />}>
        {(chat) => (
          <ChatEntryProvider value={chat}>
            <BubbleSector />
          </ChatEntryProvider>
        )}
      </Index>
    </div>
  );
}
