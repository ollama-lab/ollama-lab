import { Component } from "solid-js";
import { SectionRoot } from "../section-root";
import { SwitchRoot, SwitchControl } from "~/lib/components/ui/switch";
import { getCurrentSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";

export const HeadToHeadSection: Component = () => {
  const h2hEnabled = () => getCurrentSettings().h2h ?? false;

  return (
    <SectionRoot title="Head-to-head Mode">
      <span class="text-sm text-muted-foreground">Allow multiple LLM agents talking to each other.</span>

      <SwitchRoot
        checked={h2hEnabled()}
        onChange={(value) => setCurrentSettings("h2h", value)}
      >
        <SwitchControl />
      </SwitchRoot>
    </SectionRoot>
  );
};
