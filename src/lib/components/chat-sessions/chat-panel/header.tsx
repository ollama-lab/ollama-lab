import { Component, createMemo, Show } from "solid-js";
import { ModelSelector } from "../../custom-ui/model-selector";
import { SystemPromptToggle } from "./header/system-prompt-toggle";
import { getCurrentSettings } from "~/lib/contexts/globals/settings";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { FileSlidersIcon } from "lucide-solid";
import { Button } from "../../ui/button";
import { TextField, TextFieldTextArea } from "../../ui/text-field";
import { getCandidateSessionSystemPrompt, setCandidateSessionSystemPrompt } from "~/lib/contexts/globals/candidate-session-system-prompt";

export const ChatPanelHeader: Component = () => {
  const systemPrompt = createMemo(() => getCandidateSessionSystemPrompt());

  const updateSystemPrompt = async (value: string) => {
    await setCandidateSessionSystemPrompt(value);
  };

  return (
    <div class="sticky shrink-0 border-b border-border h-12 flex items-center backdrop-blur-lg bg-background/50">
      <div class="grow flex gap-2">
        <ModelSelector />
      </div>
      <div class="flex gap-2 px-3.5 items-center">
        <SystemPromptToggle />
        <Show when={getCurrentSettings().h2h ?? false}>
          <span class="text-sm">
            Head-to-head mode
          </span>

          <Dialog>
            <DialogTrigger as={Button} variant="outline" size="icon">
              <FileSlidersIcon class="size-4" />
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Session system prompt</DialogTitle>
              <div>
                <TextField
                  name="system-prompt"
                  defaultValue={systemPrompt()}
                >
                  <TextFieldTextArea
                    onBlur={(ev) => {
                      updateSystemPrompt(ev.currentTarget.value);
                    }}
                  />
                </TextField>
              </div>
            </DialogContent>
          </Dialog>
        </Show>
      </div>
    </div>
  );
}
