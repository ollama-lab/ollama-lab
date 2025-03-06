import { createMemo, Show } from "solid-js";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { BubbleSectorFooterStatus } from "./bubble-sector/status";
import { AssistantBubbleSectorFooterToolbar } from "./bubble-sector/assistant-toolbar";
import { SentDate } from "./sent-date";
import { useEditMode } from "~/lib/contexts/edit-mode";
import { UserBubbleSectorFooterToolbar } from "./bubble-sector/user-toolbar";

export function SectorFooter() {
  const chat = useChatEntry();
  const role = () => chat?.().role;
  const status = () => chat?.().status;

  const isCompleted = createMemo(() => {
    const c = chat?.();
    if (!c) {
      return undefined;
    }

    return c.status === "sent" || c.status === "not sent";
  });

  const editModeControl = useEditMode();
  const editMode = () => editModeControl?.get();

  return (
    <div class="flex items-center gap-2 text-xs text-muted-foreground">
      <Show when={role?.() === "assistant"}>
        <Show when={status?.() !== "sent"}>
          <BubbleSectorFooterStatus />
        </Show>

        <Show when={isCompleted()}>
          <AssistantBubbleSectorFooterToolbar />
        </Show>
      </Show>

      <Show when={chat?.().dateSent}>
        {(dateSent) => (
          <SentDate date={dateSent()} />
        )}
      </Show>
      <Show when={role() === "user" && isCompleted() && !editMode()}>
        <UserBubbleSectorFooterToolbar />
      </Show>
    </div>
  );
}
