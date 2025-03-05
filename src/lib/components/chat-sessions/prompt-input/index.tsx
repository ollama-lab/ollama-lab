import { Show, createSignal } from "solid-js";
import { submitChat } from "~/lib/contexts/globals/chat-history";
import {
  clearInputPrompt,
  getInputPrompt,
  hidePromptBar,
  isSubmittable,
  setHidePromptBar,
} from "~/lib/contexts/globals/prompt-input";
import { Button } from "../../ui/button";
import { ChevronDownIcon } from "lucide-solid";
import { cn } from "~/lib/utils/class-names";
import { getSessionWiseModel } from "~/lib/contexts/globals/session-wise-model";

export function PromptInput() {
  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>(undefined);

  const [status, setStatus] = createSignal<"submitting" | "responding" | undefined>(undefined);

  const onRespond = () => {
    setStatus("responding");
    clearInputPrompt();
  };

  const clearStatus = () => setStatus(undefined);

  return (
    <form
      ref={setFormRef}
      class="border-t border-l border-r border-secondary bg-background flex flex-col gap-1.5 px-2.5 pt-0 pb-2 rounded-t-2xl overflow-hidden transition-[margin]"
      style={`margin-bottom: -${hidePromptBar() ? (formRef()?.clientHeight ?? 0) - 16 : 0}px`}
      onSubmit={(ev) => {
        ev.preventDefault();

        if (status() || !isSubmittable()) {
          return;
        }

        const model = getSessionWiseModel();
        if (!model) {
          return;
        }

        setStatus("submitting");

        submitChat(getInputPrompt(), model, { onRespond }).finally(clearStatus);
      }}
    >
      <Button variant="ghost" class="h-4 rounded-none -mx-3 py-0" onClick={() => setHidePromptBar((cur) => !cur)}>
        <ChevronDownIcon class={cn("size-2 transition", hidePromptBar() && "-rotate-180")} />
      </Button>

      <Show when={getInputPrompt().imagePaths}></Show>
    </form>
  );
}
