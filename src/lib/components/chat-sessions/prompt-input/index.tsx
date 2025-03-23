import { Component, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { getChatHistory, submitChat } from "~/lib/contexts/globals/chat-history";
import {
  clearInputPrompt,
  getInputPrompt,
  isSubmittable as isSubmittable_,
  setInputPrompt,
} from "~/lib/contexts/globals/prompt-input";
import { Button } from "../../ui/button";
import { ArrowUpIcon, ChevronDownIcon, } from "lucide-solid";
import { cn } from "~/lib/utils/class-names";
import { ImageInfoReturn, ImagePreview } from "../../custom-ui/image-preview";
import { getThumbnailBase64 } from "~/lib/commands/image";
import { produce } from "solid-js/store";
import { PromptInputToolbar } from "./toolbar";
import { LoaderSpin } from "../../loader-spin";
import { emit } from "@tauri-apps/api/event";
import autosize from "autosize";
import { toSrcString } from "~/lib/utils/images";
import { getCurrentModel } from "~/lib/contexts/globals/current-model";
import { SessionMode } from "~/lib/models/session";

const [hidePromptBar, setHidePromptBar] = createSignal(false);

export const PromptInput: Component<{ mode?: SessionMode }> = (props) => {
  const mode = () => props.mode ?? "normal";

  const isSubmittable = createMemo(() => isSubmittable_(mode()));

  const [formRef, setFormRef] = createSignal<HTMLFormElement | undefined>(undefined);
  const [textEntryRef, setTextEntryRef] = createSignal<HTMLTextAreaElement | undefined>(undefined);

  const [status, setStatus] = createSignal<"submitting" | "responding" | undefined>(undefined);

  const onRespond = () => {
    setStatus("responding");
    clearInputPrompt();
  };

  const clearStatus = () => setStatus(undefined);

  const fetcher = async (src: string) => {
    const image = await getThumbnailBase64(src);
    return {
      result: toSrcString(image.mime, image.base64),
      origin: image.path,
    } satisfies ImageInfoReturn;
  };

  const deletePreviewItem = (i: number) => {
    setInputPrompt("imagePaths", produce((paths) => {
      if (paths) {
        paths.splice(i, 1);
      }
    }));
  }

  const busy = createMemo(() => status() === "responding" || getChatHistory()?.chats.at(-1)?.status === "sending");

  createEffect(() => {
    const ref = textEntryRef();
    if (ref) {
      autosize(ref);
    }
  });

  onCleanup(() => {
    const textEntry = textEntryRef();
    if (textEntry) {
      autosize.destroy(textEntry);
    }
  });

  const SubmitButton = () => (
    <Button
      size="icon"
      class="rounded-full"
      type="submit"
      disabled={!!status() || !isSubmittable()}
      title="Send prompt"
    >
      <Show when={status() === "submitting"} fallback={<ArrowUpIcon class="size-6!" />}>
        <LoaderSpin class="size-6!" />
      </Show>
    </Button>
  );

  const stopGeneration = async () => await emit("cancel-gen");

  return (
    <form
      ref={setFormRef}
      class="relative border-t border-l border-r border-secondary bg-background flex flex-col gap-1.5 px-2.5 pt-0 pb-2 rounded-t-2xl overflow-hidden transition-[margin] -mt-4 z-30"
      style={{
        "margin-bottom": `-${hidePromptBar() ? (formRef()?.clientHeight ?? 0) - 16 : 0}px`,
      }}
      onSubmit={(ev) => {
        ev.preventDefault();

        if (status() || !isSubmittable()) {
          return;
        }

        const model = getCurrentModel(mode());
        if (!model) {
          return;
        }

        setStatus("submitting");

        submitChat(getInputPrompt(), model, { onRespond }, mode()).finally(clearStatus);
      }}
    >
      <Button variant="ghost" class="h-4 rounded-none -mx-3 py-0" onClick={() => setHidePromptBar((cur) => !cur)}>
        <ChevronDownIcon class={cn("size-2 transition", hidePromptBar() && "-rotate-180")} />
      </Button>

      <Show when={getInputPrompt().imagePaths}>
        <ImagePreview
          srcs={getInputPrompt().imagePaths ?? []}
          fetcher={fetcher}
          onDelete={deletePreviewItem}
        />
      </Show>

      <textarea
        ref={setTextEntryRef}
        name="prompt"
        value={getInputPrompt().text}
        onInput={(ev) => setInputPrompt("text", ev.currentTarget.value)}
        class="w-full border-none outline-none resize-none bg-transparent max-h-[80dvh] md:max-h-[60dvh] lg:max-h-[30dvh] mx-2"
        placeholder="Enter your prompt here"
        onKeyPress={(ev) => {
          if (ev.key === "Enter" && !ev.shiftKey && !ev.ctrlKey) {
            ev.preventDefault();
            formRef()?.requestSubmit();
          }
        }}
      />

      <div class="flex">
        <div class="grow flex">
          <PromptInputToolbar />
        </div>

        <div class="shrink-0">
          <Show when={busy()} fallback={<SubmitButton />}>
            <Button
              size="icon"
              class="rounded-full"
              type="button"
              title="Stop generation"
              onClick={stopGeneration}
            >
              <img src="/stop-solid.svg" alt="🔲" class="size-5 invert dark:invert-0" />
            </Button>
          </Show>
        </div>
      </div>
    </form>
  );
};
