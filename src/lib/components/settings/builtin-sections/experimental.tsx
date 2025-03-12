import { Component } from "solid-js";
import { SectionRoot } from "../section-root";
import { SwitchControl, SwitchDescription, SwitchRoot } from "../../ui/switch";
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
        <SwitchDescription class="text-sm">Allow multiple LLM agents talking to each other.</SwitchDescription>
      </SwitchRoot>
    </SectionRoot>
  );
};
