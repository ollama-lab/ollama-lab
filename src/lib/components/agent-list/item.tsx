import { Component, Show } from "solid-js";
import { Agent } from "~/lib/models/agent";
import { OperationDropdown } from "./operations";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TextField, TextFieldInput, TextFieldLabel, TextFieldTextArea } from "../ui/text-field";
import { updateAgent } from "~/lib/contexts/globals/agents";

export const AgentListItem: Component<{
  agent: Agent,
}> = (props) => {
  const id = () => props.agent.id;
  const displayName = () => props.agent.name ?? props.agent.model;
  const displayModel = () => props.agent.name ? props.agent.model : undefined;
  const systemPrompt = () => props.agent.systemPrompt;

  return (
    <Dialog>
      <DialogTrigger class="group bg-secondary text-secondary-foreground rounded px-2 py-2 flex">
        <div class="flex gap-2 items-center text-sm grow truncate">
          {displayName()}
          <Show when={displayModel()}>
            {(model) => (
              <span class="text-muted-foreground text-xs">{model()}</span>
            )}
          </Show>
        </div>
        <OperationDropdown id={props.agent.id} />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{displayName()}</DialogTitle>

        <div class="flex flex-col gap-2">
          <TextField
            name="name"
            defaultValue={props.agent.name}
          >
            <TextFieldLabel>Name</TextFieldLabel>
            <TextFieldInput
              onBlur={(ev) => {
                updateAgent(id(), { name: ev.currentTarget.value });
              }}
            />
          </TextField>

          <TextField
            name="system-prompt"
            defaultValue={systemPrompt()}
          >
            <TextFieldLabel>System prompt</TextFieldLabel>
            <TextFieldTextArea
              onBlur={(ev) => {
                updateAgent(id(), { systemPrompt: ev.currentTarget.value });
              }}
            />
          </TextField>
        </div>
      </DialogContent>
    </Dialog>
  );
};
