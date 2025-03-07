import { ArrowUpIcon, XIcon } from "lucide-solid";
import { Component, createSignal } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import { TextField, TextFieldTextArea } from "~/lib/components/ui/text-field";

export const BubbleInlineEditor: Component<{
  defaultValue?: string;
  onCancel: () => void;
  onSubmit: (newValue: string) => void;
}> = (props) => {
  const [value, setValue] = createSignal<string | undefined>(props.defaultValue);

  return (
    <div class="flex flex-col gap-2 w-full px-2">
      <TextField
        class="w-full"
        value={value()}
        onChange={setValue}
      >
        <TextFieldTextArea autofocus />
      </TextField>

      <div class="flex gap-2 place-content-end">
        <Button
          variant="secondary"
          size="icon"
          title="Cancel"
          onClick={props.onCancel}
          class="rounded-full size-8"
        >
          <XIcon />
        </Button>

        <Button
          size="icon"
          onClick={() => props.onSubmit?.(value() ?? "")}
          title="Submit"
          class="rounded-full size-8"
          disabled={value() === props.defaultValue}
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
}
