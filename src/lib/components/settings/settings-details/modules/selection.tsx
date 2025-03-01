import { createMemo } from "solid-js";
import { Label } from "~/lib/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/lib/components/ui/select";

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
  const name = createMemo(() => props.name);

  return (
    <div class="flex flex-col gap-1">
      <Label for={name()}>{props.title ?? name()}</Label>

      <Select
        value={props.value}
        onChange={props.onValueChange}
        required={props.required}
        options={props.options}
        placeholder={props.placeholder}
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
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
