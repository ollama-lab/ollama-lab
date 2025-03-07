import { RegenDropdown } from "../regen-dropdown";
import { CopyButton } from "./copy-button";

export function AssistantBubbleSectorFooterToolbar() {
  return (
    <div class="flex gap-2 items-center">
      <CopyButton />
      <RegenDropdown />
    </div>
  );
}
