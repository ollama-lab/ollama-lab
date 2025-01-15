<script lang="ts">
  import { Table, TableBody, TableCell, TableRow } from "$lib/components/ui/table"

  let { value }: { value: { [key: string]: any } } = $props()
</script>

<Table>
  <TableBody>
    {#each Object.entries(value) as [key, val]}
      <TableRow>
        <TableCell class="max-w-fit font-semibold">{key}</TableCell>
        <TableCell>{val?.toString?.()}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
