<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList } from "$lib/components/ui/command"
  import { CloudDownloadIcon } from "lucide-svelte"
  import Hints from "./pull-model/hints.svelte"
  import { BASE_DOMAIN, type SearchItem } from "$lib/stores/model-search"
  import Loading from "$lib/components/custom-ui/loading.svelte"

  let open = $state(false)

  let keyword = $state("")

  let searchResult = $state<SearchItem[] | undefined>()
  let searching = $state(false)
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
    disabled={searching}
  />
  <Hints searchEntered={keyword.length > 0} searchInitiated={searchResult !== undefined} />
  <CommandList>
    <CommandEmpty>No model found.</CommandEmpty>
    {#if searchResult !== undefined}
      <CommandGroup heading="Search result">
      </CommandGroup>
    {/if}
    {#if searching}
      <div class="px-2 py-2 text-sm">
        <Loading content="Searching..." />
      </div>
    {/if}
  </CommandList>
</CommandDialog>
