import { RefreshCwIcon } from "lucide-solid";
import { createMemo, For, Show } from "solid-js";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "~/lib/components/ui/dropdown-menu";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { regenerate } from "~/lib/contexts/globals/chat-history";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";
import { useSessionMode } from "~/lib/contexts/session-mode";

export function RegenDropdown() {
  const mode = useSessionMode();

  const chat = useChatEntry();
  const chatId = () => chat?.().id;

  const candidates = createMemo(() => {
    const models = [];

    const current = chat?.().model;
    if (current) {
      models.push(current);
    }

    const sessionModel = getCurrentModel(mode());
    if (sessionModel) {
      models.push(sessionModel);
    }

    return [...new Set(models)];
  });

  const dropdownNeeded = createMemo(() => candidates().length > 1);

  const NormalButton = () => {
    return (
      <button
        title="Regenerate"
        onClick={(ev) => {
          ev.preventDefault();
          const id = chatId();
          if (id) {
            regenerate(id, mode());
          }
        }}
      >
        <RefreshCwIcon class="size-4" />
      </button>
    );
  };

  return (
    <Show when={dropdownNeeded()} fallback={<NormalButton />}>
      <DropdownMenu>
        <DropdownMenuTrigger title="Regeneratel">
          <RefreshCwIcon class="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <For each={candidates()}>
            {(modelName) => (
              <DropdownMenuItem
                class="cursor-pointer"
                onClick={() => {
                  const id = chatId();
                  if (!id) {
                    return;
                  }

                  regenerate(id, mode(), modelName);
                }}
              >
                Use {modelName}
              </DropdownMenuItem>
            )}
          </For>
        </DropdownMenuContent>
      </DropdownMenu>
    </Show>
  );
}
