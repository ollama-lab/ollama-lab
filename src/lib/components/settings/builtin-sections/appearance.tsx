import { ColorMode } from "~/lib/schemas/settings";
import SelectionModule from "../modules/selection";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";
import { getCurrentSettings, saveSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";
import NumberSection from "../modules/number";

export default function AppearanceSection() {
  const colorMode = createMemo(() => getCurrentSettings()?.appearance["color-mode"]);
  const zoom = createMemo(() => getCurrentSettings()?.appearance["zoom"]);

  const changeColorMode = (newMode: string | null) => {
    const s = getCurrentSettings();
    if (s) {
      setCurrentSettings("appearance", "color-mode", (newMode ?? "system") as ColorMode);
      saveSettings();
    }
  };

  const onZoomChange = (zoom: number | null) => {
    const s = getCurrentSettings();
    if (s) {
      setCurrentSettings("appearance", "zoom", zoom);
      saveSettings();
    }
  };

  const zoomPercentage = createMemo(() => {
    const factor = zoom();
    return factor === null ? "100%" : `${factor * 100}%`;
  });

  return (
    <SectionRoot title="Appearance">
      <SelectionModule
        name="color-mode"
        title="Color Mode"
        options={["system", "light", "dark"]}
        value={colorMode()}
        onValueChange={changeColorMode}
      />

      <NumberSection
        name="zoom"
        title="Zoom"
        value={zoom()}
        onValueChange={onZoomChange}
        min={0.3}
        max={3}
        placeholder="Default: 1"
      >
        <div>{zoomPercentage()}</div>
      </NumberSection>
    </SectionRoot>
  );
}
