import AppearanceSection from "~/lib/components/settings/builtin-sections/appearance";
import OllamaSection from "~/lib/components/settings/builtin-sections/ollama";
import { createSignal, Match, Show, Switch } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import { relaunch } from "@tauri-apps/plugin-process";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { restartVotes } from "~/lib/contexts/globals/settings";
import { DevModeSection } from "~/lib/components/settings/builtin-sections/dev-mode";
import { ExperimentalSection } from "~/lib/components/settings/builtin-sections/experimental";

export default function SettingsPage() {
  const [restarting, setRestarting] = createSignal(false);

  return (
    <div class="md:pt-10 md:pb-4 flex flex-col mx-auto max-w-screen-sm h-dvh">
      <div class="overflow-y-auto flex flex-col gap-3.5 grow px-2 py-2">
        <AppearanceSection />
        <OllamaSection />
        <ExperimentalSection />
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
              <Switch fallback={"Restart"}>
                <Match when={restarting()}>
                  <LoaderSpin class="size-4" />
                </Match>
              </Switch>
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
}
