<script lang="ts">
  import { ScrollArea } from "../ui/scroll-area"
  import type { ModelListItem, RunningModel } from "$lib/models/model-item"
  import { cn } from "$lib/utils"
  import StatusDot from "../custom-ui/status-dot.svelte"
  import { convert } from "convert"
  import dayjs from "dayjs"
  import { onMount } from "svelte"
  import { listLocalModels } from "$lib/commands/models"
  import { toast } from "svelte-sonner"
  import { Badge } from "../ui/badge"
  import { defaultModel } from "$lib/stores/models"
  import PullModel from "./model-list/pull-model.svelte"
  import Loading from "../custom-ui/loading.svelte"
  import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
  import { CircleAlertIcon, RefreshCwIcon } from "lucide-svelte"
  import { Button } from "../ui/button"
  import RelativeTime from "../custom-ui/relative-time.svelte"

  let {
    currentModel = $bindable(),
    activeModels = $bindable(),
  }: {
    currentModel?: string
    activeModels: RunningModel[]
  } = $props()

  let models = $state<ModelListItem[]>([])

  let modelFetchStatus = $state<"unfetched" | "fetching" | "error" | "fetched">("unfetched")

  async function fetchModelList(): Promise<void> {
    modelFetchStatus = "fetching"

    await listLocalModels()
      .then(result => {
        models = result
        modelFetchStatus = "fetched"
      })
      .catch((err) => {
        toast.error(err)
        modelFetchStatus = "error"
      })
  }

  onMount(() => {
    // TODO: Realtime update

    fetchModelList()
  })
</script>

<div class="w-full h-full flex flex-col">
  <div class="py-4 px-3 flex-shrink-0 flex place-items-center">
    <h2 class="text-lg font-bold select-none flex-grow">Models</h2>
    <div class="flex-shrink-0">
      <Button
        variant="outline"
        size="icon"
        disabled={modelFetchStatus === "fetching"}
        title={modelFetchStatus === "fetching" ? "Fetching..." : "Fetch model list"}
        onclick={() => {
          listLocalModels()
          toast.success("Model list updated.")
        }}
      >
        <RefreshCwIcon 
          class={cn(
            modelFetchStatus === "fetching" && "animate-spin",
          )}
        />
      </Button>
      <PullModel />
    </div>
  </div>
  <ScrollArea
    class="flex-grow"
    onclick={() => {
      currentModel = undefined
    }}
  >
    <div class="flex flex-col gap-2 pl-2 pr-4">
      {#if modelFetchStatus === "fetching"}
        <Loading content="Loading..." />
      {/if}
      {#if modelFetchStatus === "error"}
        <Alert class="bg-destructive text-destructive-foreground border-destructive">
          <CircleAlertIcon class="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch the model list.
          </AlertDescription>
        </Alert>
      {/if}
      {#each models as { name, size, modified_at }, i (name)}
        <!-- svelte-ignore a11y_click_events_have_key_events  -->
        <div
          class={cn(
            "flex flex-col rounded cursor-pointer px-2 py-2 gap-2",
            currentModel === name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          )}
          role="button"
          tabindex={i}
          onclick={(ev) => {
            currentModel = name
            ev.stopPropagation()
          }}
        >
          <div class="flex items-center select-none gap-1">
            <span class="font-bold">{name}</span>
            {#if activeModels.map(item => item.name).includes(name)}
              <StatusDot status="success" />
            {/if}

            {#if $defaultModel === name}
              <Badge
                variant={currentModel === name ? "secondary" : "default"}
                title="Newly created sessions will use this model by default."
              >
                Default
              </Badge>
            {/if}
          </div>

          <div class="flex items-center text-xs gap-1">
            <span title={`${size.toLocaleString()} bytes`}>{convert(size, "bytes").to("best", "imperial").toString(2)}</span>
            <div class="flex-grow"></div>
            <span class="flex gap-1">
              Modified
              <RelativeTime date={modified_at} />
            </span>
          </div>
        </div>
      {/each}
    </div>
  </ScrollArea>
</div>
