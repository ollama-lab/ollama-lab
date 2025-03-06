import { RefreshCwIcon } from "lucide-solid";
import { createMemo, Match, Switch } from "solid-js";
import { DropdownMenu, DropdownMenuTrigger } from "~/lib/components/ui/dropdown-menu";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { regenerate } from "~/lib/contexts/globals/chat-history";
import { getSessionWiseModel } from "~/lib/contexts/globals/session-wise-model";

export function RegenDropdown() {
  const chat = useChatEntry();
  const chatId = () => chat?.().id;

  const candidates = createMemo(() => {
    const models = [];

    const current = chat?.().model;
    if (current) {
      models.push(current);
    }

    const sessionModel = getSessionWiseModel();
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
            regenerate(id);
          }
        }}
      >
        <RefreshCwIcon class="size-4" />
      </button>
    );
  };

  return (
    <Switch fallback={<NormalButton />}>
      <Match when={dropdownNeeded()}>
        <DropdownMenu>
          <DropdownMenuTrigger title="Regenerate">
          </DropdownMenuTrigger>
        </DropdownMenu>
      </Match>
    </Switch>
  );
}
