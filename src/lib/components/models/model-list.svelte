<script lang="ts">
  import { ScrollArea } from "../ui/scroll-area"
  import { cn } from "$lib/utils"
  import StatusDot from "../custom-ui/status-dot.svelte"
  import { convert } from "convert"
  import { onMount } from "svelte"
  import { toast } from "svelte-sonner"
  import { Badge } from "../ui/badge"
  import { activeModels, currentModel, defaultModel } from "$lib/stores/models"
  import { modelList, modelListStatus } from "$lib/stores/model-list"
  import PullModel from "./model-list/pull-model.svelte"
  import Loading from "../custom-ui/loading.svelte"
  import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
  import { CircleAlertIcon, RefreshCwIcon } from "lucide-svelte"
  import { Button } from "../ui/button"
  import RelativeTime from "../custom-ui/relative-time.svelte"

  onMount(() => {
    modelList.reload()
  })
</script>

<div class="w-full h-full flex flex-col">
  <div class="py-4 px-3 flex-shrink-0 flex place-items-center">
    <h2 class="text-lg font-bold select-none flex-grow">Models</h2>
    <div class="flex-shrink-0">
      <Button
        variant="outline"
        size="icon"
        disabled={$modelListStatus === "fetching"}
        title={$modelListStatus === "fetching" ? "Refreshing..." : "Refresh model list"}
        onclick={() => {
          const reloadPromise = modelList.reload()

          toast.promise(reloadPromise, {
            loading: "Refreshing model list...",
            success: "Model list refreshed.",
            error: (err) => {
              return `Failed to refresh model list: ${err}`
            },
          })
        }}
      >
        <RefreshCwIcon 
          class={cn(
            $modelListStatus === "fetching" && "animate-spin",
          )}
        />
      </Button>
      <PullModel />
    </div>
  </div>
  <ScrollArea
    class="flex-grow"
    onclick={() => {
      $currentModel = undefined
    }}
  >
    <div class="flex flex-col gap-2 pl-2 pr-4">
      {#if $modelListStatus === "fetching"}
        <Loading content="Loading..." />
      {/if}
      {#if $modelListStatus === "error"}
        <Alert class="bg-destructive text-destructive-foreground border-destructive">
          <CircleAlertIcon class="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch the model list.
          </AlertDescription>
        </Alert>
      {/if}
      {#each $modelList as { name, size, modified_at }, i (name)}
        <!-- svelte-ignore a11y_click_events_have_key_events  -->
        <div
          class={cn(
            "flex flex-col rounded cursor-pointer px-2 py-2 gap-2",
            $currentModel === name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          )}
          role="button"
          tabindex={i}
          onclick={(ev) => {
            $currentModel = name
            ev.stopPropagation()
          }}
        >
          <div class="flex items-center select-none gap-1">
            <span class="font-bold">{name}</span>
            {#if $activeModels.map(item => item.name).includes(name)}
              <StatusDot status="success" />
            {/if}

            {#if $defaultModel === name}
              <Badge
                variant={$currentModel === name ? "secondary" : "default"}
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
