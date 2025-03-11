import { Component } from "solid-js";
import { HeaderBar } from "../custom-ui/header-bar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-solid";

export const AgentList: Component = () => {
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
      </div>
    </div>
  );
};
