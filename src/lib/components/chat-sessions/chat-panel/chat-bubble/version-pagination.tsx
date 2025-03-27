import { ChevronLeftIcon, ChevronRightIcon } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { switchBranch } from "~/lib/contexts/globals/chat-history";
import { useSessionMode } from "~/lib/contexts/session-mode";

export function VersionPagination() {
  const mode = useSessionMode();

  const chat = useChatEntry();

  const versions = () => chat?.().versions;
  const current = () => chat?.().id;

  const page = createMemo(() => {
    const pageIndex = versions()?.findIndex((id) => id === current());
    if (pageIndex === undefined) {
      return undefined;
    }

    return pageIndex + 1;
  });

  const [switching, setSwitching] = createSignal(false);

  const switchToPage = (pageNum: number) => {
    if (switching()) return;

    const ver = versions();
    if (!ver) {
      return;
    }

    setSwitching(true);
    switchBranch(ver[pageNum - 1], mode())
      .finally(() => setSwitching(false));
  };

  return (
    <Show when={versions()?.length}>
      {(length) => (
        <Show when={length() > 1}>
          <div class="flex gap-1 items-center text-muted-foreground font-bold text-xs">
            <Show when={page()}>
              {(p) => (
                <button
                  disabled={p() <= 1}
                  class="disabled:opacity-0"
                  onClick={() => switchToPage(p() - 1)}
                >
                  <ChevronLeftIcon class="size-3" />
                </button>
              )}
            </Show>

            <Show when={!switching()} fallback={<LoaderSpin class="size-3" />}>
              <span>{page?.()}</span> / <span>{versions()?.length}</span>
            </Show>

            <Show when={page()}>
              {(p) => (
                <button
                  disabled={p() >= length()}
                  class="disabled:opacity-0"
                  onClick={() => switchToPage(p() + 1)}
                >
                  <ChevronRightIcon class="size-3" />
                </button>
              )}
            </Show>
          </div>
        </Show>
      )}
    </Show>
  );
}
