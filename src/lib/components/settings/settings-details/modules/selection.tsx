import { createMemo } from "solid-js";
import { Label } from "~/lib/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "~/lib/components/ui/select";

export interface SelectionModuleProps {
  title?: string;
  name: string;
  value?: string | null;
  options: string[];
  onValueChange?: (newValue: string | null) => void;
  required?: boolean;
  placeholder?: string;
}

export default function SelectionModule(props: SelectionModuleProps) {
  const options = createMemo(() => props.options);
  const name = createMemo(() => props.name);

  return (
    <div class="flex flex-col gap-1">
      <Label for={name()}>{props.title ?? name()}</Label>

      <Select
        value={props.value}
        onChange={props.onValueChange}
        required={props.required}
        options={options()}
        placeholder={props.placeholder}
      >
        <SelectTrigger aria-label={name()}>
          <SelectValue<string>>
            {(state) => state.selectedOption()}
          </SelectValue>
        </SelectTrigger>

        <SelectContent />
      </Select>
    </div>
  );
}
