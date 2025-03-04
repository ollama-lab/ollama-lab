import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { For } from "solid-js";

export interface ModelInfoProps {
  value: { [key: string]: unknown };
}

export function ModelInfo(props: ModelInfoProps) {
  return (
    <Table>
      <TableBody>
        <For each={Object.entries(props.value)}>
          {([key, val]) => (
            <TableRow>
              <TableCell class="max-w-fit font-semibold">{key}</TableCell>
              <TableCell>{val?.toString?.()}</TableCell>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
}
