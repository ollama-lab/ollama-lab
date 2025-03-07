import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import { Component, For } from "solid-js";

export const ModelInfo: Component<{
  value: Record<string, unknown>;
}> = (props) => {
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
