import { Component, createResource, createSignal, Show, Suspense } from "solid-js";
import { getAgentTemplate } from "~/lib/commands/agent-templates";
import { selectedAgentTemplate, updateAgentTemplate } from "~/lib/contexts/globals/agents";
import { LoadingScreen } from "../custom-ui/loading-screen";
import { PlaceholderPage } from "../model-page/placeholder-title";
import { createDisplayNames } from "~/lib/utils/agents";
import { AgentTemplate, AgentTemplateUpdate } from "~/lib/schemas/agent-template";
import { Button } from "../ui/button";
import { PenIcon } from "lucide-solid";
import { TextField, TextFieldInput, TextFieldLabel, TextFieldTextArea } from "../ui/text-field";

const AgentDetails: Component<{
  content: AgentTemplate;
  onActivateEditMode?: () => void;
}> = (props) => {
  const names = createDisplayNames(() => props.content);

  const onEditClick = () => props.onActivateEditMode?.();

  const hasSystemPrompt = () => {
    const prompt = props.content.systemPrompt;
    return !!prompt && prompt.length > 0;
  };

  return (
    <div class="flex flex-col px-2 py-2 md:px-4 md:py-4 gap-2">
      <div class="flex items-center">
        <div class="flex grow gap-2 items-center">
          <b class="text-lg">{names().displayName}</b>
          <span class="text-muted-foreground">{names().displayModel}</span>
        </div>
        <div class="shrink-0">
          <Button
            variant="outline"
            size="icon"
            title="Edit"
            onClick={onEditClick}
          >
            <PenIcon />
          </Button>
        </div>
      </div>
      <div class="flex flex-col px-2 py-2 bg-secondary text-secondary-foreground rounded gap-2">
        <div class="text-sm font-bold">System prompt</div>
        <div class="whitespace-pre text-sm">
          <Show when={hasSystemPrompt()} fallback={<span class="italic">(Empty)</span>}>
            {props.content.systemPrompt}
          </Show>
        </div>
      </div>
    </div>
  );
};

const AgentTemplateEditor: Component<{
  content: AgentTemplate;
  onUpdate?: (content: AgentTemplateUpdate) => void;
  onCloseEditMode?: () => void;
}> = (props) => {
  const content = () => props.content;

  return (
    <div class="flex flex-col gap-2 px-2 py-2 md:px-4 md:py-4">
      <div class="flex">
        <div class="flex gap-2 grow">
          <TextField
            name="name"
            defaultValue={content().name}
          >
            <TextFieldInput
              placeholder="Agent name"
              onBlur={(ev) => {
                const value = ev.currentTarget.value;
                props.onUpdate?.({ name: value });
              }}
            />
          </TextField>
          <TextField
            name="model"
            defaultValue={content().model}
          >
            <TextFieldInput
              placeholder="Model name"
              onBlur={(ev) => {
                const value = ev.currentTarget.value;
                props.onUpdate?.({ model: value });
              }}
            />
          </TextField>
        </div>
        <div class="shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => props.onCloseEditMode?.()}
          >
            Done
          </Button>
        </div>
      </div>

      <TextField
        name="system-prompt"
        defaultValue={content().systemPrompt}
      >
        <TextFieldLabel>System prompt</TextFieldLabel>
        <TextFieldTextArea
          onBlur={(ev) => {
            const value = ev.currentTarget.value;
            props.onUpdate?.({ systemPrompt: value });
          }}
        />
      </TextField>
    </div>
  );
};

export const AgentTemplateDetails: Component = () => {
  const [details, { refetch }] = createResource(selectedAgentTemplate, async (id) => {
    return (await getAgentTemplate(id)) ?? undefined
  });

  const [editMode, setEditMode] = createSignal(false);

  const updateModel = async (info: AgentTemplateUpdate) => {
    const id = details()?.id;
    if (id !== undefined) {
      await updateAgentTemplate(id, info);
      await refetch();
    }
  };

  return (
    <Show when={selectedAgentTemplate() !== undefined} fallback={<PlaceholderPage />}>
      <Suspense fallback={<LoadingScreen />}>
        <Show when={details()}>
          {(content) => (
            <Show
              when={editMode()}
              fallback={<AgentDetails content={content()} onActivateEditMode={() => setEditMode(true)} />}
            >
              <AgentTemplateEditor
                content={content()}
                onUpdate={updateModel}
                onCloseEditMode={() => setEditMode(false)}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </Show>
  );
};
