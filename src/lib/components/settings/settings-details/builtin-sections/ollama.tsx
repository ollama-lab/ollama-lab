import { getCurrentSettings, saveSettings, setCurrentSettings, unvoteRestart, voteRestart } from "~/lib/contexts/globals/settings";
import TextSection from "../modules/text";
import { SectionRoot } from "../section-root";
import { createEffect, createMemo } from "solid-js";

export default function OllamaSection() {
  // Static
  const runningUri = getCurrentSettings().ollama.uri ?? null;

  const connUri = createMemo(() => getCurrentSettings().ollama.uri);
  const updateConnUri = (newValue: string | null) => {
    let uri = null;
    try {
      if (newValue) {
        uri = new URL(newValue);
      }
    } catch {}

    setCurrentSettings("ollama", "uri", uri ? uri.href : null);
    saveSettings();
  };

  createEffect(() => {
    if ((connUri() ?? null) !== runningUri) {
      voteRestart("ollama.uri");
    } else {
      unvoteRestart("ollama.uri");
    }
  });

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
