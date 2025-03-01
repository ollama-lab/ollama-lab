import { useSettings } from "~/lib/contexts/settings";
import AppearanceSection from "./builtin-sections/appearance"
import OllamaSection from "./builtin-sections/ollama";
import { createMemo, createSignal, Show } from "solid-js";
import { Button } from "../../ui/button";
import { relaunch } from "@tauri-apps/plugin-process";

const builtinSections = [
  <AppearanceSection />,
  <OllamaSection />,
];

export function SettingsDetails() {
  const settings = useSettings();

  const restartVotes = createMemo(() => settings?.[0].restartVotes ?? 0);

  const [restarting, setRestarting] = createSignal(false);

  return (
    <div class="px-2 py-2 md:pt-10 md:pb-4 flex flex-col mx-auto max-w-screen-sm h-dvh">
      <div class="overflow-y-auto flex flex-col gap-2 grow">
        {builtinSections}
      </div>
      <div class="flex">
        <Show when={restartVotes() > 0}>
          <div class="flex flex-col">
            <Button on:click={async () => {
              setRestarting(true);
              await relaunch();
            }}>
            </Button>
          </div>
        </Show>
      </div>
    </div>
  )
}
