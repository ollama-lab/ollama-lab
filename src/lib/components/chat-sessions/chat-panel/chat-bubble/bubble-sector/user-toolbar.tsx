import { SquarePenIcon } from "lucide-solid";
import { useEditMode } from "~/lib/contexts/edit-mode";

export function UserBubbleSectorFooterToolbar() {
  const editModeControl = useEditMode();

  return (
    <div>
      <button
        title="Edit"
        onClick={() => editModeControl?.set(true)}
      >
        <SquarePenIcon />
      </button>
    </div>
  );
}
