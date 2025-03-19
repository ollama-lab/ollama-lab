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

  return (
    <div
      onClick={() => {
        setSelectedAgentTemplate(id());
      }}
      class={cn(
        "rounded px-1.5 py-1",
        isSelected() && "bg-primary text-primary-foreground",
      )}
    >
      <div class="flex gap-2 items-center text-sm grow truncate">
        {names().displayName}
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
