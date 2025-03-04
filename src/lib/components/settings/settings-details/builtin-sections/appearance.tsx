import SelectionModule from "../modules/selection";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";
import { ColorMode } from "@kobalte/core";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";

export default function AppearanceSection() {
  const colorMode = createMemo(() => getCurrentSettings()?.appearance["color-mode"]);

  const changeColorMode = (newMode: string | null) => {
    const s = settings?.();
    if (s) {
      settingsContext?.set("appearance", "color-mode", (newMode ?? "system") as ColorMode);
      settingsContext?.save();
    }
  };

  return (
    <SectionRoot title="Appearance">
      <SelectionModule
        name="color-mode"
        title="Color Mode"
        options={["system", "light", "dark"]}
        value={colorMode()}
        onValueChange={changeColorMode}
      />
    </SectionRoot>
  );
}
