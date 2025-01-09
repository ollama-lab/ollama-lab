<script lang="ts">
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu"
  import { ChevronsUpDownIcon } from "lucide-svelte"

  // TODO: This is a placeholder
  const models: string[] = [
    "llama:3b",
    "llama3.2:1b",
    "mistral:7b",
    "mistral:default"
  ]

  let value = $state("")

</script>

<DropdownMenu>
  <DropdownMenuTrigger class="flex gap-2 px-4 h-full items-center">
    <span class="flex-grow truncate text-start w-28">{value}</span>
    <ChevronsUpDownIcon class="size-5" />
  </DropdownMenuTrigger>
  
  <DropdownMenuContent>
    {#each models as model}
      <DropdownMenuItem
        class="cursor-pointer"
        onclick={() => value = model}
      >
        {model}
      </DropdownMenuItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>
