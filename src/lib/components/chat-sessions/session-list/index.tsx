import { Button } from "../../ui/button";
import { PlusIcon, SearchIcon, XIcon } from "lucide-solid";
import { Component, createEffect, createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { SessionListItem } from "./item";
import { LoaderSpin } from "../../loader-spin";
import { HeaderBar } from "../../custom-ui/header-bar";
import { clearChatHistory } from "~/lib/contexts/globals/chat-history";
import { getAllSessions, reloadSessions } from "~/lib/contexts/globals/sessions";
import { useSessionMode } from "~/lib/contexts/session-mode";

export const SessionList: Component<{
  title: string;
}> = (props) => {
  const mode = useSessionMode();
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");

  const onNewSession = () => {
    clearChatHistory(mode(), true);
  };

  createEffect(() => {
    reloadSessions(mode());
  });

  const sessionList = createMemo(() => getAllSessions(mode()) ?? []);

  const normalizedSearchQuery = createMemo(() => searchQuery().trim().toLowerCase());

  const filteredSessionList = createMemo(() => {
    const query = normalizedSearchQuery();
    const sessions = sessionList();

    if (!query) {
      return sessions;
    }

    return sessions.filter((session) => {
      const title = (session.title ?? "New Chat").toLowerCase();
      return title.includes(query);
    });
  });

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title={props.title}>
        <Button size="icon" variant="outline" title="Search sessions" aria-label="Search sessions" onClick={openSearch}>
          <SearchIcon />
        </Button>
        <Button size="icon" variant="outline" title="New session" onClick={onNewSession}>
          <PlusIcon />
        </Button>
      </HeaderBar>

      <Show when={searchOpen()}>
        <div class="px-2 pb-2">
          <div class="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1.5">
            <SearchIcon class="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery()}
              onInput={(ev) => setSearchQuery(ev.currentTarget.value)}
              placeholder="Search session titles"
              class="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button size="icon" variant="ghost" class="size-7" title="Close search" onClick={closeSearch}>
              <XIcon class="size-4" />
            </Button>
          </div>
        </div>
      </Show>

      <div class="grow overflow-y-auto">
        <Suspense fallback={<LoaderSpin class="size-4" />}>
          <div class="flex flex-col gap-2 px-2">
            <For each={filteredSessionList()}>
              {(session) => <SessionListItem sessionId={session.id} title={session.title ?? undefined} />}
            </For>
            <Show when={filteredSessionList().length < 1}>
              <div class="py-6 text-center text-sm text-muted-foreground">No matching sessions</div>
            </Show>
          </div>
        </Suspense>
      </div>
    </div>
  );
};
