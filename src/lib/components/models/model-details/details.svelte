<script lang="ts" module>
  export interface DetailEntry {
    name: string
    valueFn: (v: ModelDetails) => string
  }

  export const DETAIL_ENTRIES: DetailEntry[] = [
    {
      name: "Format",
      valueFn: value => value.format,
    },
    {
      name: "Parent Model",
      valueFn: value => value.parent_model,
    },
    {
      name: "Family",
      valueFn: value => value.family,
    },
    {
      name: "Families",
      valueFn: value => value.families.toString(),
    },
    {
      name: "Parameter Size",
      valueFn: value => value.parameter_size,
    },
    {
      name: "Quantization Level",
      valueFn: value => value.quantization_level,
    },
  ]
</script>

<script lang="ts">
  import { Table, TableBody, TableCell, TableRow } from "$lib/components/ui/table"
  import type { ModelDetails } from "$lib/models/model-item"

  let { value }: { value: ModelDetails } = $props()
</script>

<Table>
  <TableBody>
    {#each DETAIL_ENTRIES as { name, valueFn }}
      <TableRow>
        <TableCell class="max-w-10 font-semibold">{name}</TableCell>
        <TableCell>{valueFn(value)}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
