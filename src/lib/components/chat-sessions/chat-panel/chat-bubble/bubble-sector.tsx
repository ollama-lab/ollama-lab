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
import { SectorFooter } from "./sector-footer";
import { EditModeProvider } from "~/lib/contexts/edit-mode";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { TriangleAlertIcon } from "lucide-solid";
import { SystemPromptBlock } from "./bubble-sector/system-prompt-block";

export function BubbleSector() {
  const chat = useChatEntry();

  const role = createMemo(() => chat?.().role);
  const model = createMemo(() => chat?.().model);
  const status = createMemo(() => chat?.().status);

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
                  {/* TODO: Dynamic avatar */}
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

                <EditModeProvider accessor={editMode} setter={setEditMode}>
                  <SectorFooter />
                </EditModeProvider>
              </div>
            </div>
          </div>

          <Show when={role() === "user"}>
            <Switch>
              <Match when={status() === "sending"}>
                <LoaderSpin />
              </Match>
              <Match when={status() === "not sent"}>
                <TriangleAlertIcon class="text-yellow-600" />
              </Match>
            </Switch>
          </Show>
        </div>
      </Match>
      <Match when={role() === "system"}>
        <SystemPromptBlock />
      </Match>
    </Switch>
  );
}
