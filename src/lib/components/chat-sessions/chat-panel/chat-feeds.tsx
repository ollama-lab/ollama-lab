import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  onCleanup,
  onMount,
  Show,
  untrack,
} from "solid-js";
import { ArrowDownIcon } from "lucide-solid";
import { ChatEntryProvider } from "~/lib/contexts/chat-entry";
import { getChatHistory } from "~/lib/contexts/globals/chat-history";
import { cn } from "~/lib/utils/class-names";
import { BubbleSector } from "./chat-bubble/bubble-sector";
import { ChatFindBar } from "./chat-find-bar";
import { useSessionMode } from "~/lib/contexts/session-mode";

const Hints: Component = () => {
  const keyHints: Record<string, string> = {
    Enter: "Send prompt",
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
};

const WelcomeText: Component = () => {
  return (
    <div class="text-center flex flex-col gap-3.5">
      <span class="select-none font-bold text-2xl">Hello there! 👋</span>
      <Hints />
    </div>
  );
};

export const ChatFeeds: Component = () => {
  const mode = useSessionMode();

  const [rootRef, setRootRef] = createSignal<HTMLDivElement>();
  const [scrollAreaRef, setScrollAreaRef] = createSignal<HTMLDivElement>();
  const [findInputRef, setFindInputRef] = createSignal<HTMLInputElement>();

  const [autoScroll, setAutoScroll] = createSignal(true);
  const [showJumpToLatest, setShowJumpToLatest] = createSignal(false);
  const [findOpen, setFindOpen] = createSignal(false);
  const [findQuery, setFindQuery] = createSignal("");
  const [activeMatchIndex, setActiveMatchIndex] = createSignal(0);

  let followRaf: number | undefined;
  let lastAssistantMessageId: number | undefined;

  const NEAR_BOTTOM_THRESHOLD_PX = 96;

  const currentChatHistory = createMemo(() => getChatHistory(mode()));
  const chats = createMemo(() => currentChatHistory()?.chats ?? []);

  const normalizedQuery = createMemo(() => findQuery().trim().toLowerCase());

  const latestChat = createMemo(() => chats().at(-1));
  const assistantIsStreaming = createMemo(() => {
    const chat = latestChat();
    return chat?.role === "assistant" && (chat.status === "preparing" || chat.status === "sending");
  });
  const assistantStreamState = createMemo(() => {
    const chat = latestChat();
    if (!chat || chat.role !== "assistant") {
      return undefined;
    }

    return {
      id: chat.id,
      status: chat.status,
      contentLength: chat.content.length,
      thoughtsLength: chat.thoughts?.length ?? 0,
    };
  });

  const isNearBottom = (scrollArea: HTMLDivElement) => {
    return scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <= NEAR_BOTTOM_THRESHOLD_PX;
  };

  const cancelFollowFrame = () => {
    if (followRaf !== undefined) {
      window.cancelAnimationFrame(followRaf);
      followRaf = undefined;
    }
  };

  const scrollToLatest = (behavior: ScrollBehavior = "auto") => {
    const scrollArea = scrollAreaRef();
    if (!scrollArea) {
      return;
    }

    cancelFollowFrame();
    followRaf = window.requestAnimationFrame(() => {
      scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior });
      followRaf = undefined;
    });
  };

  const syncAutoFollowState = () => {
    const scrollArea = scrollAreaRef();
    if (!scrollArea) {
      return;
    }

    const nearBottom = isNearBottom(scrollArea);
    setAutoScroll(nearBottom);
    setShowJumpToLatest(assistantIsStreaming() && !nearBottom);
  };

  const matchedChatIds = createMemo(() => {
    const query = normalizedQuery();
    if (!query) {
      return [] as number[];
    }

    return chats()
      .filter((chat) => {
        const content = chat.content.toLowerCase();
        const thoughts = chat.thoughts?.toLowerCase() ?? "";
        return content.includes(query) || thoughts.includes(query);
      })
      .map((chat) => chat.id);
  });

  const activeMatchChatId = createMemo(() => matchedChatIds().at(activeMatchIndex()));

  const focusFindInput = () => {
    queueMicrotask(() => {
      const input = untrack(findInputRef);
      if (!input) {
        return;
      }
      input.focus();
      input.select();
    });
  };

  const moveToNextMatch = () => {
    const matches = matchedChatIds();
    if (matches.length === 0) {
      return;
    }

    setActiveMatchIndex((index) => (index + 1) % matches.length);
  };

  const moveToPreviousMatch = () => {
    const matches = matchedChatIds();
    if (matches.length === 0) {
      return;
    }

    setActiveMatchIndex((index) => (index - 1 + matches.length) % matches.length);
  };

  const closeFind = () => {
    setFindOpen(false);
  };

  onMount(() => {
    const isActiveInChatScope = () => {
      const root = rootRef();
      const activeElement = document.activeElement;

      if (!root) {
        return false;
      }

      if (!activeElement || activeElement === document.body || activeElement === document.documentElement) {
        return true;
      }

      if (!(activeElement instanceof HTMLElement)) {
        return false;
      }

      const scope = root.closest<HTMLElement>("[data-chat-shortcut-scope='true']") ?? root;
      return scope.contains(activeElement);
    };

    const onWindowKeyDown = (ev: KeyboardEvent) => {
      const lowerKey = ev.key.toLowerCase();
      const activeInChatScope = isActiveInChatScope();

      if (!activeInChatScope) {
        return;
      }

      if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && !ev.shiftKey && lowerKey === "f") {
        ev.preventDefault();
        setFindOpen(true);
        focusFindInput();
        return;
      }

      if (ev.key === "Escape" && untrack(findOpen)) {
        ev.preventDefault();
        closeFind();
      }
    };

    window.addEventListener("keydown", onWindowKeyDown);
    onCleanup(() => {
      cancelFollowFrame();
      window.removeEventListener("keydown", onWindowKeyDown);
    });
  });

  createEffect(() => {
    const root = rootRef();
    const scrollArea = root?.parentElement;
    if (!(scrollArea instanceof HTMLDivElement)) {
      setScrollAreaRef(undefined);
      return;
    }

    setScrollAreaRef(scrollArea);

    const onScroll = () => {
      syncAutoFollowState();
    };

    scrollArea.addEventListener("scroll", onScroll, { passive: true });
    syncAutoFollowState();

    onCleanup(() => {
      scrollArea.removeEventListener("scroll", onScroll);
    });
  });

  createEffect(() => {
    const chat = latestChat();
    if (!chat || chat.role !== "assistant") {
      return;
    }

    if (chat.status === "preparing" && chat.id !== lastAssistantMessageId) {
      lastAssistantMessageId = chat.id;
      if (autoScroll()) {
        scrollToLatest("smooth");
      }
    }
  });

  createEffect(() => {
    const streamState = assistantStreamState();
    if (!streamState) {
      setShowJumpToLatest(false);
      return;
    }

    syncAutoFollowState();

    if (autoScroll() && (streamState.status === "sending" || streamState.status === "preparing")) {
      scrollToLatest("auto");
    }
  });

  createEffect(() => {
    const matches = matchedChatIds();
    const current = activeMatchIndex();
    if (matches.length === 0) {
      if (current !== 0) {
        setActiveMatchIndex(0);
      }
      return;
    }

    if (current >= matches.length) {
      setActiveMatchIndex(matches.length - 1);
    }
  });

  createEffect(() => {
    normalizedQuery();
    setActiveMatchIndex(0);
  });

  createEffect(() => {
    if (!findOpen()) {
      return;
    }

    const activeId = activeMatchChatId();
    if (activeId === undefined) {
      return;
    }

    const root = rootRef();
    if (!root) {
      return;
    }

    const target = root.querySelector<HTMLElement>(`[data-chat-id="${activeId}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const hasChatHistory = createMemo(() => {
    const chatHistory = currentChatHistory();
    if (!chatHistory) {
      return false;
    }

    return chatHistory.chats.length > 0;
  });

  return (
    <div
      ref={setRootRef}
      class={cn(
        "relative flex flex-col flex-wrap text-wrap max-w-5xl mx-auto pb-4",
        !hasChatHistory() && "h-full place-content-center items-center",
      )}
    >
      <Show when={findOpen()}>
        <ChatFindBar
          inputRef={setFindInputRef}
          query={findQuery()}
          currentMatch={activeMatchIndex() + 1}
          totalMatches={matchedChatIds().length}
          onQueryInput={setFindQuery}
          onPrevious={moveToPreviousMatch}
          onNext={moveToNextMatch}
          onClose={closeFind}
        />
      </Show>

      <Index each={currentChatHistory()?.chats} fallback={<WelcomeText />}>
        {(chat) => (
          <ChatEntryProvider value={chat}>
            <BubbleSector
              highlighted={matchedChatIds().includes(chat().id)}
              activeHighlight={activeMatchChatId() === chat().id}
            />
          </ChatEntryProvider>
        )}
      </Index>

      <Show when={showJumpToLatest()}>
        <button
          type="button"
          class="sticky bottom-3 ml-auto mr-1 z-20 inline-flex items-center gap-1 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur hover:bg-accent"
          onClick={() => {
            setAutoScroll(true);
            setShowJumpToLatest(false);
            scrollToLatest("smooth");
          }}
        >
          <ArrowDownIcon class="size-3.5" />
          Jump to latest
        </button>
      </Show>
    </div>
  );
};
