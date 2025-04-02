import { ColorMode } from "~/lib/schemas/settings";
import SelectionModule from "../modules/selection";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";
import { getCurrentSettings, saveSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";

export default function AppearanceSection() {
  const colorMode = createMemo(() => getCurrentSettings()?.appearance["color-mode"]);

  const changeColorMode = (newMode: string | null) => {
    const s = getCurrentSettings();
    if (s) {
      setCurrentSettings("appearance", "color-mode", (newMode ?? "system") as ColorMode);
      saveSettings();
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
