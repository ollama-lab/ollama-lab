import { Component, Show } from "solid-js";
import { Agent } from "~/lib/models/agent";
import { OperationDropdown } from "./operations";

export const AgentListItem: Component<{
  agent: Agent,
}> = (props) => {
  const displayName = () => props.agent.name ?? props.agent.model;
  const displayModel = () => props.agent.name ? props.agent.model : undefined;

  return (
    <div class="group bg-secondary text-secondary-foreground rounded px-2 py-2 flex">
      <div class="flex gap-2 items-center text-sm grow truncate">
        {displayName()}
        <Show when={displayModel()}>
          {(model) => (
            <span class="text-muted-foreground text-xs">{model()}</span>
          )}
        </Show>
      </div>
      <OperationDropdown />
    </div>
  );
};
