import { Component, For, onMount } from "solid-js";
import { HeaderBar } from "../custom-ui/header-bar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-solid";
import { getAgentList, reloadAgentList } from "~/lib/contexts/globals/agents";
import { toast } from "solid-sonner";
import { AgentListItem } from "./item";

export const AgentList: Component = () => {
  onMount(() => {
    reloadAgentList().catch((err) => toast.error(String(err)));
  });

  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title="Agents">
        <Button
          variant="outline"
          size="icon"
          title="New agent"
        >
          <PlusIcon />
        </Button>
      </HeaderBar>

      <div class="flex flex-col grow">
        <For each={getAgentList()}>
          {(agent) => (
            <AgentListItem agent={agent} />
          )}
        </For>
      </div>
    </div>
  );
};
