<script lang="ts">
  import { CloudDownloadIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import type { ModelListItem, RunningModel } from "$lib/models/model-item"
  import { cn } from "$lib/utils"
  import StatusDot from "../custom-ui/status-dot.svelte"
  import { convert } from "convert"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"
  import { onMount } from "svelte"
  import type { CommandError } from "$lib/models/errors"
  import { listLocalModels } from "$lib/commands/models"
  import { toast } from "svelte-sonner"
  import { Badge } from "../ui/badge"

  dayjs.extend(relativeTime)

  let {
    currentModel = $bindable(),
    activeModels = $bindable(),
  }: {
    currentModel?: string
    activeModels: RunningModel[]
  } = $props()

  let models = $state<ModelListItem[]>([])

  onMount(() => {
    // TODO: Realtime update

    listLocalModels()
      .then(result => models = result)
      .catch((err: CommandError) => {
        toast.error(err.message)
      })
  })
</script>

<div class="w-full h-full flex flex-col">
  <div class="py-4 px-3 flex-shrink-0 flex place-items-center">
    <h2 class="text-lg font-bold select-none flex-grow">Models</h2>
    <div class="flex-shrink-0">
      <Button
        size="icon"
        variant="outline"
        title="Pull model"
        onclick={() => {
        }}
      >
        <CloudDownloadIcon />
      </Button>
    </div>
  </div>
  <ScrollArea
    class="flex-grow"
    onclick={() => {
      currentModel = undefined
    }}
  >
    <div class="flex flex-col gap-2 pl-2 pr-4">
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

            <Badge variant={currentModel === name ? "secondary" : "default"}>
              Default
            </Badge>
          </div>

          <div class="flex items-center text-xs gap-1">
            <span title={`${size.toLocaleString()} bytes`}>{convert(size, "bytes").to("best", "imperial").toString(2)}</span>
            <div class="flex-grow"></div>
            <span
              title={modified_at.toLocaleString()}
            >
              Modified {dayjs(modified_at).fromNow()}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </ScrollArea>
</div>
