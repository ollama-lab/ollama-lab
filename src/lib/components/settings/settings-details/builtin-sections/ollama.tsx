import { useSettings } from "~/lib/contexts/settings";
import TextSection from "../modules/text";
import { SectionRoot } from "../section-root";
import { createMemo } from "solid-js";

export default function OllamaSection() {
  const settings = useSettings();

  const connUri = createMemo(() => settings?.settings.ollama.uri);
  const updateConnUri = (newValue: string | null) => {
    settings?.set("ollama", "uri", newValue)
  }

  return (
    <SectionRoot title="Ollama">
      <TextSection
        type="text"
        value={connUri()}
        onValueChange={updateConnUri}
        placeholder="http://localhost:11434"
        name="uri"
        title="Connection URI"
      />
    </SectionRoot>
  );
}
