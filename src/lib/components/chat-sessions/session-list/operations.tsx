import { createSignal } from "solid-js";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "lucide-solid";
import { DropdownMenuContent } from "@kobalte/core/src/dropdown-menu/dropdown-menu-content.jsx";
import { DeletionDialog } from "./operations/deletion-dialog";

export interface OperationsDropdownProps {
  sessionId: number;
  onEdit?: () => void;
}

export function OperationsDropdown(props: OperationsDropdownProps) {
  const sessionId = () => props.sessionId;

  const [open, setOpen] = createSignal(false);

  const [deletionDialogOpen, setDeletionDialogOpen] = createSignal(false);

  return (
    <>
      <DropdownMenu open={open()} onOpenChange={setOpen}>
        <DropdownMenuTrigger on:click={(ev) => ev.stopPropagation()}>
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="text-sm">
          <DropdownMenuItem
            on:click={() => {
              props.onEdit?.();
              setOpen(false);
            }}
          >
            <SquarePenIcon class="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem class="bg-destructive text-destructive-foreground">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletionDialog sessionId={sessionId()} open={deletionDialogOpen} onOpenChange={setDeletionDialogOpen} />
    </>
  );
}
