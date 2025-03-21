import { Component, For, onMount } from "solid-js";
import { HeaderBar } from "../custom-ui/header-bar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-solid";
import { addAgentTemplate, getAgentTemplateList, reloadAgentTemplateList, setSelectedAgentTemplate } from "~/lib/contexts/globals/agents";
import { toast } from "solid-sonner";
import { AgentTemplateListItem } from "./item";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";

export const AgentTemplateList: Component = () => {
  onMount(() => {
    reloadAgentTemplateList().catch((err) => toast.error(String(err)));
  });

  const onAddTemplate = async () => {
    const model = getCurrentModel();
    if (model === null) {
      toast.warning("No model selected.");
      return;
    }

    const id = await addAgentTemplate({ model });
    setSelectedAgentTemplate(id);
  };

  return (
    <div
      class="w-full h-full flex flex-col"
      onClick={() => {
        setSelectedAgentTemplate(undefined);
      }}
    >
      <HeaderBar title="Agent Personas">
        <Button
          variant="outline"
          size="icon"
          title="New agent"
          onClick={onAddTemplate}
        >
          <PlusIcon />
        </Button>
      </HeaderBar>

      <div class="flex flex-col grow gap-1 px-2 overflow-y-auto">
        <For each={getAgentTemplateList()}>
          {(agent) => (
            <AgentTemplateListItem agent={agent} />
          )}
        </For>
      </div>
    </div>
  );
};
