import { createMemo, createSignal } from "solid-js";
import { InputType, TextField, TextFieldInput, TextFieldLabel } from "~/lib/components/ui/text-field";

export interface TextSectionProps {
  title?: string;
  name: string;
  value?: string | null;
  onValueChange?: (newValue: string | null) => void;
  required?: boolean;
  placeholder?: string;
  type?: InputType;
}

export default function TextSection(props: TextSectionProps) {
  const name = createMemo(() => props.name);
  const inputType = createMemo(() => props.type ?? "text");
  const onValueChange = props.onValueChange;

  const [instantValue, setInstantValue] = createSignal<string | undefined>(props.value ?? undefined);

  return (
    <div class="flex flex-col gap-1">
      <TextField class="flex flex-col max-w-sm gap-2">
        <TextFieldLabel for={name()}>{props.title ?? name()}</TextFieldLabel>
        <TextFieldInput
          type={inputType()}
          name={name()}
          placeholder={props.placeholder}
          value={instantValue() ?? props.value ?? ""}
          onInput={(ev) => setInstantValue(ev.currentTarget.value)}
          onBlur={() => {
            const value = instantValue()?.trim();
            if (value) {
              if (value.length < 1) {
                onValueChange?.(null);
              } else {
                onValueChange?.(value);
              }

              setInstantValue(undefined);
            }
          }}
        />
      </TextField>
    </div>
  )
}
