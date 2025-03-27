import { Component } from "solid-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVerticalIcon, TrashIcon } from "lucide-solid";
import { deleteAgentTemplate } from "~/lib/contexts/globals/agents";

export const OperationDropdown: Component<{ id: number }> = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        class="group-[selected]:bg-primary group-[selected]:text-primary-foreground"
      >
        <EllipsisVerticalIcon class="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          class="bg-destructive text-destructive-foreground flex gap-2 cursor-pointer"
          on:click={(ev) => {
            ev.stopPropagation();
            deleteAgentTemplate(props.id);
          }}
        >
          <TrashIcon class="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
