import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getModelSystemPrompt } from "~/lib/commands/system-prompts";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { SwitchControl, SwitchLabel, SwitchRoot } from "~/lib/components/ui/switch";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { getInputPrompt, setInputPrompt } from "~/lib/contexts/globals/prompt-input";
import { getSessionWiseModel } from "~/lib/contexts/globals/session-wise-model";

export function SystemPromptToggle() {
  const systemPrompt = createAsync(async () => {
    const model = getSessionWiseModel();
    if (!model) {
      return null;
    }

    return await getModelSystemPrompt(model);
  });

  return (
    <div class="px-2">
      <Suspense fallback={<LoaderSpin class="size-4" />}>
        <Show when={!currentSession() && !!systemPrompt()}>
          <SwitchRoot
            class="flex gap-2 items-center"
            name="use-system-prompt"
            checked={getInputPrompt().useSystemPrompt}
            onChange={(value) => setInputPrompt("useSystemPrompt", value)}
          >
            <SwitchControl />
            <SwitchLabel>Use system prompt</SwitchLabel>
          </SwitchRoot>
        </Show>
      </Suspense>
    </div>
  );
}
