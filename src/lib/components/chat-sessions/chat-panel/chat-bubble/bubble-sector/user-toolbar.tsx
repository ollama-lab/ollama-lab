import { SquarePenIcon } from "lucide-solid";
import { useEditMode } from "~/lib/contexts/edit-mode";
import { CopyButton } from "./copy-button";

export function UserBubbleSectorFooterToolbar() {
  const editModeControl = useEditMode();

  return (
    <div class="flex gap-2 items-center">
      <CopyButton />
      <button
        title="Edit"
        onClick={() => editModeControl?.set(true)}
      >
        <SquarePenIcon class="size-4" />
      </button>
    </div>
  );
}
