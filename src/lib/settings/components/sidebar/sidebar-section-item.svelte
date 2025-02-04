<script lang="ts">
  import { settingsSchema } from "$lib/settings/types"
  import { en } from "$lib/settings/names/en"
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label"
  import { settings } from "$lib/stores/settings"
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select"

  const t = en

  let { key, subkey }: {
    key: string
    subkey: string
  } = $props()
  
  let schema = $derived(settingsSchema[key][subkey])
  let id = $derived(`${key}.${subkey}`)
  let title = $derived(t[id])

</script>

<div class="px-2 py-2">
  {#if schema.type === "boolean"}
    <div class="flex items-center gap-2">
      <Checkbox
        {id}
        bind:checked={() => settings.get(key, subkey) ?? schema.default, (newValue) => settings.setItem(key, subkey, newValue)}
      />
      <Label for={id}>{title}</Label>
    </div>
  {:else if schema.type === "enum"}
    <div class="flex flex-col gap-2">
      {#if !schema.multiple}
        <Select
          type="single"
          bind:value={() => settings.get(key, subkey) ?? schema.default, (newValue) => settings.setItem(key, subkey, newValue)}
        >
          <SelectTrigger></SelectTrigger>
          <SelectContent>
            {#each schema.values as value}
              <SelectItem {value}>{value}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
      {/if}
    </div>
  {/if}
</div>
