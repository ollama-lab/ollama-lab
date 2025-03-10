import { Component } from "solid-js";
import { SectionRoot } from "../section-root";
import { SwitchRoot, SwitchControl } from "~/lib/components/ui/switch";

export const HeadToHeadSection: Component = () => {
  return (
    <SectionRoot title="Head-to-head Mode">
      <span class="text-sm text-muted-foreground">Allow multiple LLM agents talking to each other.</span>

      <SwitchRoot>
        <SwitchControl />
      </SwitchRoot>
    </SectionRoot>
  );
};
