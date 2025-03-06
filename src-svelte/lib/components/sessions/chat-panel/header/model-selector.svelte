<script lang="ts">
  import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command";
  import type { ModelListItem } from "$lib/models/model-item"
  import { modelList } from "$lib/stores/model-list"
  import { selectedSessionModel } from "$lib/stores/models"
  import { ChevronsUpDownIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  let open = $state(false)

  async function internalSetSessionModel(model: string): Promise<void> {
    await selectedSessionModel.set(model)
    open = false
  }

  let groupedModelList = $derived($modelList.reduce((acc, cur) => {
    const prefix = cur.name.split(":").at(0) ?? "Misc"

    acc[prefix] = [...acc[prefix] ?? [], cur]
    return acc
  }, {} as { [key: string]: ModelListItem[] }))

  $effect(() => {
    if (open) {
      modelList.init()
        .catch(err => {
          toast.error(`${err}`)
        })
    }
  })
</script>

<button
  class="flex gap-2 px-4 h-full items-center"
  onclick={() => open = true}
>
  <span class="flex-grow truncate text-start w-36 text-sm">{$selectedSessionModel}</span>
  <ChevronsUpDownIcon class="size-4" />
</button>

<CommandDialog bind:open>
  <CommandInput
    placeholder="Search local models"
    onclick={(ev) => internalSetSessionModel(ev.currentTarget.value)}
  />
  <CommandList>
    <CommandEmpty>No matched model found.</CommandEmpty>
      {#each Object.entries(groupedModelList) as [prefix, list] (prefix)}
        <CommandGroup heading={prefix}>
          {#each list as { name } (name)}
            <CommandItem onclick={() => internalSetSessionModel(name)}>{name}</CommandItem>
          {/each}
        </CommandGroup>
      {/each}
  </CommandList>
</CommandDialog>
