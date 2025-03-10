import { clearChatHistory } from "~/lib/contexts/globals/chat-history";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-solid";
import { Component, For, Suspense } from "solid-js";
import { getAllSessions } from "~/lib/contexts/globals/sessions";
import { SessionListItem } from "./item";
import { LoaderSpin } from "../../loader-spin";
import { HeaderBar } from "../../custom-ui/header-bar";

export const SessionList: Component = () => {
  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title="Sessions">
        <Button size="icon" variant="outline" title="New session" onClick={() => clearChatHistory(true)}>
          <PlusIcon />
        </Button>
      </HeaderBar>

      <div class="grow overflow-y-auto">
        <Suspense fallback={<LoaderSpin class="size-4" />}>
          <div class="flex flex-col gap-2 px-2">
            <For each={getAllSessions()}>
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
