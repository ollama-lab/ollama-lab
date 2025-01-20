<script lang="ts">
  import { CommandGroup, CommandLinkItem } from "$lib/components/ui/command"
  import type { SearchResult } from "$lib/stores/model-search"
  import SearchResultItem from "./search-result-item.svelte"

  let {
    searchResult,
    isPullNext = false,
    onInitiatePull,
  }: {
    searchResult: SearchResult,
    isPullNext?: boolean
    onInitiatePull?: (model: string) => void
  } = $props()
</script>

<CommandGroup heading="Search result">
  {#each searchResult.result as item (item.name)}
    <SearchResultItem {item} {onInitiatePull} />
  {/each}
</CommandGroup>
