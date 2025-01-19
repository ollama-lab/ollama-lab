<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandLoading } from "$lib/components/ui/command"
  import { CloudDownloadIcon } from "lucide-svelte"
  import Hints from "./pull-model/hints.svelte"
  import { BASE_DOMAIN, type SearchItem } from "$lib/stores/model-search"

  let open = $state(false)

  let keyword = $state("")

  let searchResult = $state<SearchItem[] | undefined>()
</script>

<Button
  size="icon"
  variant="outline"
  title="Pull model"
  onclick={() => {
    open = true
  }}
>
  <CloudDownloadIcon />
</Button>

<CommandDialog
  bind:open
  shouldFilter={false}
>
  <CommandInput
    placeholder={`Pull model from ${BASE_DOMAIN}`}
    bind:value={() => keyword, (newValue) => (keyword = newValue)}
  />
  <Hints searchEntered={keyword.length > 0} searchInitiated={searchResult !== undefined} />
  <CommandList>
    <CommandEmpty>No model found.</CommandEmpty>
    {#if searchResult !== undefined}
      <CommandGroup heading="Search result">
      </CommandGroup>
    {/if}
  </CommandList>
</CommandDialog>
