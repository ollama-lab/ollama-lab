import { Component } from "solid-js";
import { SectionRoot } from "../section-root";
import { SwitchControl, SwitchDescription, SwitchLabel, SwitchRoot } from "../../ui/switch";
import { getCurrentSettings, saveSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";

export const ExperimentalSection: Component = () => {
  const h2hEnabled = () => getCurrentSettings().h2h ?? false;

  return (
    <SectionRoot title="Experimental">
      <SwitchRoot
        class="flex gap-2.5 items-center"
        checked={h2hEnabled()}
        onChange={(value) => {
          setCurrentSettings("h2h", value);
          saveSettings();
        }}
      >
        <SwitchControl />
        <div class="flex flex-col gap-1">
          <SwitchLabel>Head-to-head mode</SwitchLabel>
          <SwitchDescription class="text-xs text-muted-foreground">
            Allow multiple LLM agents talking to each other.
          </SwitchDescription>
        </div>
      </SwitchRoot>
    </SectionRoot>
  );
};
