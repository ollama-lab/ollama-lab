import { Show } from "solid-js";
import { ModelSelector } from "../../custom-ui/model-selector";
import { SystemPromptToggle } from "./header/system-prompt-toggle";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";

export function ChatPanelHeader() {
  return (
    <div class="sticky shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
      <div class="grow flex gap-2">
        <ModelSelector />
        <Show when={getCurrentSettings().h2h ?? false}>
          <span class="text-sm">
            Head-to-head mode
          </span>
        </Show>
      </div>
      <SystemPromptToggle />
    </div>
  );
}
