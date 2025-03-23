import { Component, createEffect, For } from "solid-js";
import { CommandDialog, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { getAgentTemplateList, reloadAgentTemplateList } from "~/lib/contexts/globals/agents";
import AgentNameGroup from "../../custom-ui/agent-name-group";

const AgentCreationCommand: Component<{
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onSelected?: (value: number) => void;
}> = (props) => {
  const open = () => props.open;
  const onOpenChange = (value: boolean) => props.onOpenChange?.(value);

  createEffect(() => {
    if (open()) {
      reloadAgentTemplateList();
    }
  });

  const selected = (id: number) => {
    props.onSelected?.(id);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open()} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search agent seeds" />
      <CommandList>
        <For each={getAgentTemplateList()}>
          {(item) => (
            <CommandItem
              class="flex gap-2 items-center cursor-pointer"
              on:click={() => {
                selected(item.id);
              }}
            >
              <AgentNameGroup item={item} />
            </CommandItem>
          )}
        </For>
      </CommandList>
    </CommandDialog>
  );
};

export default AgentCreationCommand;
