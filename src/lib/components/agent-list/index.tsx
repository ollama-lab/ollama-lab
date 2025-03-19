import { Component, For, onMount } from "solid-js";
import { HeaderBar } from "../custom-ui/header-bar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-solid";
import { addAgentTemplate, getAgentTemplateList, reloadAgentTemplateList } from "~/lib/contexts/globals/agents";
import { toast } from "solid-sonner";
import { AgentListItem } from "./item";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";

export const AgentList: Component = () => {
  onMount(() => {
    reloadAgentTemplateList().catch((err) => toast.error(String(err)));
  });

  return (
    <div class="w-full h-full flex flex-col">
      <HeaderBar title="Agents">
        <Button
          variant="outline"
          size="icon"
          title="New agent"
          onClick={() => {
            const model = getCurrentModel();
            if (model === null) {
              toast.warning("No model selected.");
              return;
            }

            addAgentTemplate({ model });
          }}
        >
          <PlusIcon />
        </Button>
      </HeaderBar>

      <div class="flex flex-col grow gap-1 px-2 overflow-y-auto">
        <For each={getAgentTemplateList()}>
          {(agent) => (
            <AgentListItem agent={agent} />
          )}
        </For>
      </div>
    </div>
  );
};
