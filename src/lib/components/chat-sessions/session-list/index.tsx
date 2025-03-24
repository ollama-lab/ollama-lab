import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-solid";
import { Component, createEffect, createMemo, For, Suspense } from "solid-js";
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

  const onNewSession = () => {
    clearChatHistory(mode(), true);
  };

  createEffect(() => {
    reloadSessions(mode());
  });

  const sessionList = createMemo(() => getAllSessions(mode()));

  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title={props.title}>
        <Button size="icon" variant="outline" title="New session" onClick={onNewSession}>
          <PlusIcon />
        </Button>
      </HeaderBar>

      <div class="grow overflow-y-auto">
        <Suspense fallback={<LoaderSpin class="size-4" />}>
          <div class="flex flex-col gap-2 px-2">
            <For each={sessionList()}>
              {(session) => (
                <SessionListItem sessionId={session.id} title={session.title ?? undefined} />
              )}
            </For>
          </div>
        </Suspense>
      </div>
    </div>
  );
};
