import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { ChatImagePreview } from "~/lib/components/custom-ui/image-preview";
import { Avatar, AvatarImage } from "~/lib/components/ui/avatar";
import { useChatEntry } from "~/lib/contexts/chat-entry";
import { cn } from "~/lib/utils/class-names";
import { ThoughtsSection } from "./thoughts-section";
import { Bubble } from "./bubble";
import { BubbleInlineEditor } from "./inline-editor";
import { editPrompt } from "~/lib/contexts/globals/chat-history";
import { VersionPagination } from "./version-pagination";

export function BubbleSector() {
  const chat = useChatEntry();

  const role = createMemo(() => chat?.().role);
  const model = createMemo(() => chat?.().model);

  const [editMode, setEditMode] = createSignal(false);

  return (
    <Switch>
      <Match when={role() === "user" || role() === "assistant"}>
        <div
          class={cn(
            "group/bubble-sector flex py-1 gap-2 items-center",
            role() === "user" ? "place-content-end" : "place-content-start",
          )}
        >
          <div class="flex flex-col w-full">
            <div class="flex gap-2 w-full">
              <Show when={role() === "assistant"}>
                <Avatar>
                  <AvatarImage src="/ollama.svg" alt="Ollama" class="bg-white p-1 pb-0" />
                </Avatar>
              </Show>

              <div
                class={cn(
                  "flex flex-col gap-1 w-full",
                  role() === "user" && "items-end",
                )}
              >
                <span class="text-xs font-bold">
                  <Switch>
                    <Match when={role() === "assistant"}>
                      {model()}
                    </Match>
                    <Match when={role() === "user"}>
                      You
                    </Match>
                  </Switch>
                </span>

                <Show when={chat?.().imageCount}>
                  {(imageCount) => (
                    <Show when={imageCount() > 0}>
                      <Show when={chat?.().id}>
                        {(id) => (
                          <ChatImagePreview chatId={id()} />
                        )}
                      </Show>
                    </Show>
                  )}
                </Show>

                <Show when={role() === "assistant"}>
                  <ThoughtsSection />
                </Show>

                <Switch fallback={<Bubble />}>
                  <Match when={editMode()}>
                    <BubbleInlineEditor
                      defaultValue={chat?.().content}
                      onCancel={() => setEditMode(false)}
                      onSubmit={(newValue) => {
                        const c = chat?.();
                        const id = c?.id;
                        const model = c?.model;

                        if (id === undefined || model === undefined) {
                          return;
                        }

                        editPrompt({ text: newValue }, id, model, {
                          onRespond() {
                            setEditMode(false);
                          },
                        });
                      }}
                    />
                  </Match>
                </Switch>

                <Show when={chat?.().versions}>
                  <VersionPagination />
                </Show>
              </div>
            </div>
          </div>
        </div>
      </Match>
      <Match when={role() === "system"}>
        <></>
      </Match>
    </Switch>
  );
}
