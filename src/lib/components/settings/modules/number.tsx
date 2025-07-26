import { children, Component, createMemo, createSignal, JSX } from "solid-js";
import { TextField, TextFieldInput, TextFieldLabel } from "~/lib/components/ui/text-field";

const NumberSection: Component<{
  title?: string;
  name: string;
  value?: number | null;
  onValueChange?: (newValue: number | null) => void;
  required?: boolean;
  placeholder?: string;
  max?: number;
  min?: number;
  integer?: boolean;
  children?: JSX.Element;
}> = (props) => {
  const name = createMemo(() => props.name);
  const value = () => props.value;

  const valueString = () => value()?.toString();
  const [instantValue, setInstantValue] = createSignal<string | undefined>(valueString() ?? undefined);

  const parseNumber = (value: string) => props.integer ? parseInt(value) : Number(value);

  const resolvedChildren = children(() => props.children);

  return (
    <div class="flex flex-col gap-1">
      <TextField class="flex flex-col max-w-sm gap-2">
        <TextFieldLabel for={name()}>{props.title ?? name()}</TextFieldLabel>
        <TextFieldInput
          type="text"
          name={name()}
          placeholder={props.placeholder}
          value={instantValue() ?? valueString() ?? undefined} 
          onInput={(ev) => setInstantValue(ev.currentTarget.value)}
          onBlur={() => {
            const value = instantValue();
            if (value !== undefined && value.trim() !== "") {
              let num = parseNumber(value);
              if (props.max !== undefined && num > props.max) {
                num = props.max;
              } else if (props.min !== undefined && num < props.min) {
                num = props.min;
              }
              props.onValueChange?.(num);
              setInstantValue(undefined);
            } else {
              props.onValueChange?.(null);
            }
          }}
        />
      </TextField>
      {resolvedChildren()}
    </div>
  );
}

export default NumberSection;
