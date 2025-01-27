<script lang="ts">
  import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command";
  import { modelList } from "$lib/stores/model-list"
  import { selectedSessionModel } from "$lib/stores/models"
  import { ChevronsUpDownIcon } from "lucide-svelte"

  let open = $state(false)

  async function internalSetSessionModel(model: string): Promise<void> {
    await selectedSessionModel.set(model)
    open = false
  }
</script>

<button
  class="flex gap-2 px-4 h-full items-center"
  onclick={() => open = true}
>
  <span class="flex-grow truncate text-start w-28">{$selectedSessionModel}</span>
  <ChevronsUpDownIcon class="size-5" />
</button>

<CommandDialog bind:open>
  <CommandInput
    placeholder="Search local models"
    onclick={(ev) => internalSetSessionModel(ev.currentTarget.value)}
  />
  <CommandList>
    <CommandEmpty>No matched model found.</CommandEmpty>
    <CommandGroup heading="Models">
      {#each $modelList as { name } (name)}
        <CommandItem onclick={() => internalSetSessionModel(name)}>{name}</CommandItem>
      {/each}
    </CommandGroup>
  </CommandList>
</CommandDialog>
