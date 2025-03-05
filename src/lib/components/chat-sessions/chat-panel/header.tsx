import { ModelSelector } from "../../custom-ui/model-selector";

export function ChatPanelHeader() {
  return (
    <div class="sticky shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
      <div class="grow flex gap-2">
        <ModelSelector />
      </div>
    </div>
  );
}
