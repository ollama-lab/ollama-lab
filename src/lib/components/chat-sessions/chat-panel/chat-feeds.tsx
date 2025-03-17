import { createEffect, createMemo, createSignal, For, Index, Show } from "solid-js";
import { ChatEntryProvider } from "~/lib/contexts/chat-entry";
import { getChatHistory } from "~/lib/contexts/globals/chat-history";
import { cn } from "~/lib/utils/class-names";
import { BubbleSector } from "./chat-bubble/bubble-sector";

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
                  <Show when={key !== "+" && key !== "/"} fallback={key}>
                    <kbd>{key}</kbd>
                  </Show>
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
    const chat = getChatHistory()?.chats.at(-1)

    if (chat?.content || chat?.thoughts) {
      const root = rootRef();
      if (root && autoScroll()) {
        root.parentElement?.scrollTo(0, root.scrollHeight);
      }
    }
  });

  const hasChatHistory = createMemo(() => {
    const chatHistory = getChatHistory();
    if (!chatHistory) {
      return false;
    }

    return chatHistory.chats.length > 0;
  });

  return (
    <div
      ref={setRootRef}
      class={cn(
        "flex flex-col flex-wrap text-wrap max-w-5xl mx-auto pb-4",
        !hasChatHistory() && "h-full place-content-center items-center",
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
