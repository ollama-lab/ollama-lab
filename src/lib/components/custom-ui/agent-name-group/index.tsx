import { Component, Show } from "solid-js";
import { createDisplayNames, InputNames } from "~/lib/utils/agents";

const AgentNameGroup: Component<{ item: InputNames }> = (props) => {
  const item = () => props.item;
  const displayNames = createDisplayNames(item);

  return (
    <>
      <Show when={displayNames().displayName}>
        {(name) => (
          <span class="font-bold">{name()}</span>
        )}
      </Show>

      <Show when={displayNames().displayModel}>
        {(model) => (
          <span class="text-muted-foreground text-sm">{model()}</span>
        )}
      </Show>
    </>
  );
};

export default AgentNameGroup;
