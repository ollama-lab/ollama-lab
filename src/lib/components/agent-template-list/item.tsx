import { Component, createMemo, Show } from "solid-js";
import { OperationDropdown } from "./operations";
import { AgentListItem } from "~/lib/models/agent";
import { selectedAgentTemplate, setSelectedAgentTemplate } from "~/lib/contexts/globals/agents";
import { cn } from "~/lib/utils/class-names";
import { createDisplayNames } from "~/lib/utils/agents";

export const AgentTemplateListItem: Component<{
  agent: AgentListItem,
}> = (props) => {
  const id = () => props.agent.id;
  const names = createDisplayNames(() => props.agent);

  const isSelected = createMemo(() => selectedAgentTemplate() === id());

  const itemClicked = () => setSelectedAgentTemplate(id());

  return (
    <div
      on:click={(ev) => {
        ev.stopPropagation();
        itemClicked();
      }}
      class={cn(
        "group flex rounded px-2 py-2 cursor-pointer",
        isSelected() && "selected bg-primary text-primary-foreground",
      )}
    >
      <div class="flex gap-2 items-center text-sm grow truncate">
        <b>{names().displayName}</b>
        <Show when={names().displayModel}>
          {(model) => (
            <span class="text-muted-foreground text-xs">{model()}</span>
          )}
        </Show>
      </div>
      <OperationDropdown id={props.agent.id} />
    </div>
  );
};
