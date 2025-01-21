<script lang="ts">
  import { CommandGroup } from "$lib/components/ui/command"
  import type { SearchResult } from "$lib/stores/model-search"
  import SearchResultItem from "./search-result-item.svelte"

  let {
    searchResult,
    onInitiatePull,
  }: {
    searchResult: SearchResult,
    onInitiatePull?: (model: string) => void
  } = $props()
</script>

<CommandGroup heading="Search result">
  {#each searchResult.result as item (item.name)}
    <SearchResultItem {item} {onInitiatePull} />
  {/each}
</CommandGroup>
