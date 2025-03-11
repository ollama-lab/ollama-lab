import { Component } from "solid-js";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-solid";

export const OperationDropdown: Component = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon class="size-4 opacity-0 group-hover:opacity-100" />
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};
