import { Component } from "solid-js";
import { ModelSelector } from "../../custom-ui/model-selector";
import { SystemPromptToggle } from "./header/system-prompt-toggle";

export const ChatPanelHeader: Component = () => {
  return (
    <div class="sticky shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
      <div class="grow flex gap-2">
        <ModelSelector />
        <SystemPromptToggle />
      </div>
    </div>
  );
};
