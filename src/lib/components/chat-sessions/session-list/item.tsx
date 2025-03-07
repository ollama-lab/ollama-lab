import { Component, Match, Show, Switch } from "solid-js";
import { createSignal } from "solid-js";
import { toast } from "solid-sonner";
import { getChatHistoryStore } from "~/lib/contexts/globals/chat-history";
import { cn } from "~/lib/utils/class-names";
import { LoaderSpin } from "../../loader-spin";
import { TextField, TextFieldInput } from "../../ui/text-field";
import { renameSession } from "~/lib/commands/sessions";
import { reloadSession } from "~/lib/contexts/globals/sessions";
import { OperationsDropdown } from "./operations";
import { currentSession, setCurrentSessionId } from "~/lib/contexts/globals/current-session";

export const SessionListItem: Component<{
  sessionId: number;
  title?: string | undefined;
}> = (props) => {
  const title = () => props.title;
  const sessionId = () => props.sessionId;

  const [renameMode, setRenameMode] = createSignal(false);
  const [optimisticTitle, setOptimisticTitle] = createSignal<string | undefined>(undefined);

  const Title = () => (
    <>
      <div class="w-full truncate">{optimisticTitle() ?? title() ?? "New Chat"}</div>
      <Show when={currentSession()?.id === sessionId() && getChatHistoryStore()?.loading}>
        <LoaderSpin class="size-4" />
      </Show>
    </>
  );

  return (
    <div
      class={cn(
        "flex items-center px-3 py-2 rounded cursor-pointer min-h-12",
        currentSession()?.id === sessionId() ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
      )}
      onClick={() => {
        try {
          setCurrentSessionId(sessionId());
        } catch (err) {
          toast.error(`Error: ${err}`);
        }
      }}
      role="button"
      tabindex={sessionId()}
      onDblClick={() => setRenameMode(true)}
    >
      <div class="grow select-none truncate text-sm flex gap-2 items-center">
        <Switch fallback={<Title />}>
          <Match when={renameMode()}>
            <TextField defaultValue={title() ?? ""} class="w-full">
              <TextFieldInput
                class="text-foreground bg-background w-full"
                onLoad={(ev) => ev.currentTarget.focus()}
                on:keydown={(ev) => {
                  switch (ev.key) {
                    case "Enter":
                      if (!ev.ctrlKey && !ev.metaKey && !ev.altKey && !ev.shiftKey) {
                        ev.currentTarget.blur();
                      }

                      break;

                    default:
                      break;
                  }
                }}
                on:blur={(ev) => {
                  setRenameMode(false);

                  const newTitle = ev.currentTarget.value.trim();
                  if (newTitle.length < 1 || newTitle === title()) {
                    return;
                  }

                  setOptimisticTitle(title());

                  const s = sessionId();

                  (async () => {
                    try {
                      await renameSession(s, newTitle);
                      await reloadSession(s);
                    } catch (err) {
                      toast.error(`Error: ${err}`);
                    } finally {
                      setOptimisticTitle(undefined);
                    }
                  })();
                }}
              />
            </TextField>
          </Match>
        </Switch>
      </div>
      <Show when={!renameMode()}>
        <div class="shrink-0 flex items-center">
          <OperationsDropdown sessionId={sessionId()} onEdit={() => setRenameMode(true)} />
        </div>
      </Show>
    </div>
  );
}
