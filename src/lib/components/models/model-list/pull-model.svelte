<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "$lib/components/ui/command"
  import { CloudDownloadIcon } from "lucide-svelte"
  import Hints from "./pull-model/hints.svelte"
  import { BASE_DOMAIN, type SearchResult } from "$lib/stores/model-search"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { toast } from "svelte-sonner"
  import { searchModel } from "$lib/search/model-search"
  import SearchResultSection from "./pull-model/search-result-section.svelte"

  let open = $state(false)

  let keyword = $state("")

  let searchResult = $state<SearchResult | undefined>()
  let searching = $state(false)

  let isPullNext = $derived(searchResult !== undefined && keyword === searchResult.keyword)

  function startPullModel(model: string) {
    open = false
  }

  async function startSearchModels() {
    if (searching) {
      return
    }

    searching = true
    try {
      searchResult = {
        keyword,
        category: "all",
        orderedBy: "popular",
        result: Array.from(await searchModel(keyword)),
      }
    } catch (e) {
      toast.error(`${e}`)
      return
    } finally {
      searching = false
    }
  }
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
    placeholder={`Search model on ${BASE_DOMAIN}`}
    bind:value={() => keyword, (newValue) => (keyword = newValue.trim())}
    disabled={searching}
    onkeydown={(ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault()

        if (ev.ctrlKey) {
          startPullModel(keyword)
        } else {
          startSearchModels()
        }
      }
    }}
  />
  <Hints searchEntered={keyword.length > 0} {isPullNext} />
  <CommandList>
    {#if searching}
      <div class="px-2 py-2 text-sm">
        <Loading content="Searching..." />
      </div>
    {/if}
    {#if searchResult !== undefined}
      <SearchResultSection
        {searchResult}
        {isPullNext}
        onInitiatePull={(model) => {
          startPullModel(model)
        }}
      />
    {/if}
    <CommandEmpty>No model found.</CommandEmpty>
  </CommandList>
</CommandDialog>
