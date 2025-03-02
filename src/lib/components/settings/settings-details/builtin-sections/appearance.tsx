import { useSettings } from "~/lib/contexts/settings";
import SelectionModule from "../modules/selection";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";
import { ColorMode } from "@kobalte/core";

export default function AppearanceSection() {
  const settingsContext = useSettings();
  const settings = settingsContext?.settings;

  const colorMode = createMemo(() => settings?.()?.appearance["color-mode"]);

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
