<script lang="ts">
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select"

  // TODO: This is a placeholder
  const models: string[] = [
    "llama:3b",
    "llama3.2:1b",
    "mistral:7b",
    "mistral:default"
  ]

  let value = $state("")

</script>

<Select type="single" name="model" bind:value>
  <SelectTrigger class="w-40">
    {value}
  </SelectTrigger>
  <SelectContent>
    {#each models as model}
      <SelectItem value={model} label={model}>
        {model}
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
