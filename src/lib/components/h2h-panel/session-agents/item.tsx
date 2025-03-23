import { GripVerticalIcon } from "lucide-solid";
import { Component, createSignal } from "solid-js";
import { AgentListItem } from "~/lib/models/agent";
import { cn } from "~/lib/utils/class-names";
import AgentNameGroup from "../../custom-ui/agent-name-group";

export const SessionAgentsItem: Component<{ item: AgentListItem }> = (props) => {
  const id = () => props.item.id;

  const [dragging, setDragging] = createSignal(false);

  return (
    <div
      draggable="true"
      class={cn(
        "select-none flex gap-2 items-center px-2 py-2 rounded border border-border",
        "hover:bg-muted"
      )}
      onDragStart={(ev) => {
        setDragging(true);
        if (ev.dataTransfer) {
          ev.dataTransfer.setData("text/plain", String(id()));
          ev.dataTransfer.effectAllowed = "move";
        }
      }}
      onDragEnd={() => {
        setDragging(false);
      }}
      onMouseDown={() => {
        setDragging(true);
      }}
      onMouseUp={() => {
        setDragging(false);
      }}
    >
      <div
        class="flex gap-2 items-center grow overflow-x-auto px-1 cursor-pointer"
        draggable="false"
        on:dragstart={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        }}
      >
        <AgentNameGroup item={props.item} />
      </div>

      <div class={cn(
        "flex items-center cursor-grab",
        dragging() && "cursor-grabbing",
      )}>
        <GripVerticalIcon class="size-4" />
      </div>
    </div>
  );
};
