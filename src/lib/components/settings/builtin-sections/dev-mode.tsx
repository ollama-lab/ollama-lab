import { SwitchControl, SwitchRoot } from "~/lib/components/ui/switch";
import { SectionRoot } from "../section-root";
import { devModeEnabled, setDevModeEnabled } from "~/lib/contexts/globals/dev-tools/dev-mode";

export function DevModeSection() {
  return (
    <SectionRoot title="Developer Mode">
      <span class="text-sm text-muted-foreground">Enable features for helping debug. Normal folks don't need this enabled :)</span>

      <SwitchRoot
        checked={devModeEnabled()}
        onChange={setDevModeEnabled}
      >
        <SwitchControl />
      </SwitchRoot>
    </SectionRoot>
  );
}
