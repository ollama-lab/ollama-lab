import { Component, createSignal } from "solid-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "lucide-solid";
import { DeletionDialog } from "./operations/deletion-dialog";
import { SessionMode } from "~/lib/models/session";

export const OperationsDropdown: Component<{
  sessionId: number;
  onEdit?: () => void;
  mode: SessionMode;
}> = (props) => {
  const sessionId = () => props.sessionId;

  const [open, setOpen] = createSignal(false);

  const [deletionDialogOpen, setDeletionDialogOpen] = createSignal(false);

  return (
    <>
      <DropdownMenu open={open()} onOpenChange={setOpen}>
        <DropdownMenuTrigger on:click={(ev) => ev.stopPropagation()}>
          <EllipsisVerticalIcon class="size-4 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="text-sm">
          <DropdownMenuItem
            class="cursor-pointer"
            on:click={(ev) => {
              ev.stopPropagation();
              props.onEdit?.();
              setOpen(false);
            }}
          >
            <SquarePenIcon class="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            class="bg-destructive text-destructive-foreground cursor-pointer"
            on:click={(ev) => {
              ev.stopPropagation();
              setDeletionDialogOpen(true)
            }}
          >
            <TrashIcon class="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletionDialog sessionId={sessionId()} open={deletionDialogOpen} onOpenChange={setDeletionDialogOpen} mode={props.mode} />
    </>
  );
}
