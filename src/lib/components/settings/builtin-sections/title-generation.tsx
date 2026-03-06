import { createMemo } from "solid-js";
import { getCurrentSettings, saveSettings, setCurrentSettings } from "~/lib/contexts/globals/settings";
import { modelList } from "~/lib/contexts/globals/model-states";
import { SectionRoot } from "../section-root";
import SelectionModule from "../modules/selection";
import { SwitchControl, SwitchDescription, SwitchLabel, SwitchRoot } from "../../ui/switch";
import { TextField, TextFieldTextArea } from "../../ui/text-field";

const DEFAULT_PROMPT_HINT =
  "Default prompt: Generate a concise 2-5 word title for this conversation. Return only the title text.";

const SESSION_MODEL_OPTION = "(Use session model)";

export function TitleGenerationSection() {
  const options = createMemo(() => [SESSION_MODEL_OPTION, ...modelList().map((item) => item.name)]);

  const enabled = createMemo(() => getCurrentSettings()["title-generation"].enabled);
  const configuredModel = createMemo(() => getCurrentSettings()["title-generation"].model);
  const systemPrompt = createMemo(() => getCurrentSettings()["title-generation"]["system-prompt"] ?? "");

  return (
    <SectionRoot title="Title Generation">
      <SwitchRoot
        class="flex gap-2.5 items-center"
        checked={enabled()}
        onChange={(value) => {
          setCurrentSettings("title-generation", "enabled", value);
          saveSettings();
        }}
      >
        <SwitchControl />
        <div class="flex flex-col gap-1">
          <SwitchLabel>Generate chat titles</SwitchLabel>
          <SwitchDescription class="text-xs text-muted-foreground">
            Generate a title after the first user prompt and assistant response.
          </SwitchDescription>
        </div>
      </SwitchRoot>

      <SelectionModule
        name="title-generation-model"
        title="Model"
        options={options()}
        value={configuredModel() ?? SESSION_MODEL_OPTION}
        onValueChange={(value) => {
          setCurrentSettings("title-generation", "model", value === SESSION_MODEL_OPTION ? null : value);
          saveSettings();
        }}
      />

      <div class="flex flex-col gap-2">
        <TextField
          value={systemPrompt()}
          onChange={(value) => setCurrentSettings("title-generation", "system-prompt", value)}
        >
          <span class="text-sm">System Prompt</span>
          <TextFieldTextArea
            onBlur={() => {
              const current = getCurrentSettings()["title-generation"]["system-prompt"]?.trim() ?? "";
              setCurrentSettings("title-generation", "system-prompt", current.length > 0 ? current : null);
              saveSettings();
            }}
          />
        </TextField>
        <span class="text-xs text-muted-foreground">{DEFAULT_PROMPT_HINT}</span>
      </div>
    </SectionRoot>
  );
}
