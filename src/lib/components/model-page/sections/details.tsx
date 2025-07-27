import { ModelDetails } from "~/lib/schemas/model-item";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { Component, For } from "solid-js";

interface DetailEntry {
  name: string;
  valueFn: (v: ModelDetails) => string;
}

const DETAIL_ENTRIES: DetailEntry[] = [
  {
    name: "Format",
    valueFn: (value) => value.format,
  },
  {
    name: "Parent Model",
    valueFn: (value) => value.parent_model,
  },
  {
    name: "Family",
    valueFn: (value) => value.family,
  },
  {
    name: "Families",
    valueFn: (value) => value.families?.toString() ?? "",
  },
  {
    name: "Parameter Size",
    valueFn: (value) => value.parameter_size,
  },
  {
    name: "Quantization Level",
    valueFn: (value) => value.quantization_level,
  },
];

export const Details: Component<{
  value: ModelDetails;
}> = (props) => {
  return (
    <Table>
      <TableBody>
        <For each={DETAIL_ENTRIES}>
          {({ name, valueFn }) => (
            <TableRow>
              <TableCell class="w-44 font-semibold">{name}</TableCell>
              <TableCell>{valueFn(props.value)}</TableCell>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
}
