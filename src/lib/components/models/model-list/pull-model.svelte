<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "$lib/components/ui/command"
  import { CloudDownloadIcon } from "lucide-svelte"
  import Hints from "./pull-model/hints.svelte"
  import { BASE_DOMAIN, BASE_URL, type SearchResult } from "$lib/stores/model-search"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { toast } from "svelte-sonner"
  import { searchModel } from "$lib/search/model-search"
  import SearchResultSection from "./pull-model/search-result-section.svelte"
  import { fly } from "svelte/transition"
  import { openUrl } from "@tauri-apps/plugin-opener"
  import { modelList } from "$lib/stores/model-list"
  import { pullModelTasks } from "$lib/stores/pull-model"
  import { pullModel } from "$lib/commands/models"

  let open = $state(false)

  let keyword = $state("")

  let searchResult = $state<SearchResult | undefined>()
  let searching = $state(false)

  async function startPullModel(model: string) {
    const downloadedAlready = $modelList.filter(({ name }) => name === model).length > 0
    if (downloadedAlready) {
      toast.error("Model already downloaded")
      return
    }

    const downloading = Object.keys($pullModelTasks).includes(model)
    if (downloading) {
      toast.warning("Model downloading")
      return
    }

    pullModelTasks.add(model, "Starting pulling...")
    open = false

    return pullModel(model)
      .catch(err => pullModelTasks.error(model, `Error: ${err}`))
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
    placeholder={`Search models on ${BASE_DOMAIN}`}
    bind:value={() => keyword, (newValue) => (keyword = newValue.trim())}
    disabled={searching}
    onkeydown={(ev) => {
      if (ev.key === "End") {
        ev.preventDefault()
        ev.stopPropagation()
        const value = ev.currentTarget.value
        ev.currentTarget.setSelectionRange(value.length, value.length)
        return
      }

      if (ev.key === "Home") {
        ev.preventDefault()
        ev.stopPropagation()
        ev.currentTarget.setSelectionRange(0, 0)
      }

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
  <div class="flex">
    <Button
      variant="link"
      size="sm"
      class="text-xs flex gap-0"
      onclick={async () => {
        await openUrl(keyword.length > 0 ? `${BASE_URL}/search?` + new URLSearchParams({ q: keyword }) : BASE_URL)
      }}
    >
      <span class="z-[1]">Visit {BASE_DOMAIN}</span>
      {#if keyword.length > 0}
        <span class="-ml-[1px]" transition:fly={{ x: -30, y: 0, duration: 300 }}>
          &nbsp;with "{keyword}"
        </span>
      {/if}
    </Button>
  </div>
  <Hints searchEntered={keyword.length > 0} />
  <CommandList>
    {#if searching}
      <div class="px-2 py-2 text-sm">
        <Loading content="Searching..." />
      </div>
    {/if}
    {#if searchResult !== undefined}
      <SearchResultSection
        {searchResult}
        onInitiatePull={startPullModel}
      />
    {/if}
    <CommandEmpty>No model found.</CommandEmpty>
  </CommandList>
</CommandDialog>
