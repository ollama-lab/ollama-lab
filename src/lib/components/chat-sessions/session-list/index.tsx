import { clearChatHistory } from "~/lib/contexts/globals/chat-history";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-solid";
import { Component, For, Show, Suspense } from "solid-js";
import { getAllSessions } from "~/lib/contexts/globals/sessions";
import { SessionListItem } from "./item";
import { LoaderSpin } from "../../loader-spin";

export const SessionList: Component<{
  isH2h?: boolean;
}> = (props) => {
  const isH2h = () => props.isH2h ?? false;

  return (
    <div class="w-full h-full flex flex-col">
      <div class="sticky py-4 px-3 flex-shrink-0 flex place-items-center bg-background/50 backdrop-blur-lg">
        <h2 class="text-lg font-bold select-none flex-grow">Sessions</h2>
        <div class="shrink-0">
          <Button size="icon" variant="outline" title="New session" onClick={() => clearChatHistory(true)}>
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div class="grow overflow-y-auto">
        <Suspense fallback={<LoaderSpin class="size-4" />}>
          <div class="flex flex-col gap-2 px-2">
            <For each={getAllSessions()}>
              {(session) => (
                <Show when={session.isH2h === isH2h()}>
                  <SessionListItem sessionId={session.id} title={session.title ?? undefined} />
                </Show>
              )}
            </For>
          </div>
        </Suspense>
      </div>
    </div>
  );
};
