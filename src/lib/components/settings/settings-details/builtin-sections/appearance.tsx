import { useSettings } from "~/lib/contexts/settings";
import SelectionModule from "../modules/selection";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";
import { ColorMode } from "@kobalte/core";

export default function AppearanceSection() {
  const settingsContext = useSettings();
  const settingsStore = createMemo(() => settingsContext?.[0]);
  const saveSettingsFn = createMemo(() => settingsContext?.[1].save);

  const colorMode = createMemo(() => settingsStore()?.settings?.appearance["color-mode"]);

  const changeColorMode = (newMode: string | null) => {
    if (newMode) {
      const settings = settingsStore()?.settings;
      if (settings) {
        settings.appearance["color-mode"] = newMode as ColorMode;
        saveSettingsFn()?.(settings);
      }
    }
  }

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
