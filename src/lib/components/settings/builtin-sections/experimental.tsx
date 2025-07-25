import { Component } from "solid-js";
import { SectionRoot } from "../section-root";
import { SwitchControl, SwitchDescription, SwitchLabel, SwitchRoot } from "../../ui/switch";
import { isH2hEnabled, saveSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";

export const ExperimentalSection: Component = () => {
  return (
    <SectionRoot title="Experimental">
      <SwitchRoot
        class="flex gap-2.5 items-center"
        checked={isH2hEnabled()}
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
