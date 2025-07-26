import { children, Component, createMemo, createSignal, JSX } from "solid-js";
import { InputType, TextField, TextFieldInput, TextFieldLabel } from "~/lib/components/ui/text-field";

const TextSection: Component<{
  title?: string;
  name: string;
  value?: string | null;
  onValueChange?: (newValue: string | null) => void;
  required?: boolean;
  placeholder?: string;
  type?: InputType;
  children?: JSX.Element;
}> = (props) => {
  const name = createMemo(() => props.name);
  const inputType = createMemo(() => props.type ?? "text");
  const value = () => props.value;

  const [instantValue, setInstantValue] = createSignal<string | undefined>(value() ?? undefined);

  const resolvedChildren = children(() => props.children);

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
            if (value !== undefined) {
              if (value.length < 1) {
                props.onValueChange?.(null);
              } else {
                props.onValueChange?.(value);
              }

              setInstantValue(undefined);
            }
          }}
        />
        {resolvedChildren()}
      </TextField>
    </div>
  );
}

export default TextSection;
