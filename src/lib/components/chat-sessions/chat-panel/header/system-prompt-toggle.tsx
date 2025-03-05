import { SwitchLabel } from "@kobalte/core/src/switch/switch-label.jsx";
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getModelSystemPrompt } from "~/lib/commands/system-prompts";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { SwitchButton, SwitchField } from "~/lib/components/ui/switch";
import { getChatHistory } from "~/lib/contexts/globals/chat-history";
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
        <Show when={!getChatHistory() && !!systemPrompt()}>
          <SwitchField name="use-system-prompt">
            <SwitchButton />
            <SwitchLabel>Use system prompt</SwitchLabel>
          </SwitchField>
        </Show>
      </Suspense>
    </div>
  );
}
