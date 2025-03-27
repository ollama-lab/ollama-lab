import AppearanceSection from "../builtin-sections/appearance";
import OllamaSection from "../builtin-sections/ollama";
import { createSignal, Show } from "solid-js";
import { Button } from "../../ui/button";
import { relaunch } from "@tauri-apps/plugin-process";
import { LoaderSpin } from "../../loader-spin";
import { restartVotes } from "~/lib/contexts/globals/settings";
import { DevModeSection } from "../builtin-sections/dev-mode";

export function SettingsDetails() {
  const [restarting, setRestarting] = createSignal(false);

  return (
    <div class="md:pt-10 md:pb-4 flex flex-col mx-auto max-w-screen-sm h-dvh">
      <div class="overflow-y-auto flex flex-col gap-3.5 grow px-2 py-2">
        <AppearanceSection />
        <OllamaSection />
        <DevModeSection />
      </div>
      <div class="flex">
        <Show when={restartVotes().length > 0}>
          <div class="flex flex-col">
            <Button
              on:click={() => {
                setRestarting(true);
                relaunch();
              }}
            >
              <Show when={restarting()} fallback={"Restart"}>
                <LoaderSpin class="size-4" />
              </Show>
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
}
