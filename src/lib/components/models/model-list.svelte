<script lang="ts">
  import { CloudDownloadIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import type { ModelListItem } from "$lib/models/model-item"
  import { cn } from "$lib/utils"
  import StatusDot from "../custom-ui/status-dot.svelte"
  import { convert } from "convert"
  import dayjs from "dayjs"
  import relativeTime from "dayjs/plugin/relativeTime"

  dayjs.extend(relativeTime)

  let {
    currentModel = $bindable(),
  }: {
    currentModel?: string
  } = $props()

  // Stub data
  const models: ModelListItem[] = [
    {
      name: "llama3.2:3b",
      digest: "STUB",
      modifiedAt: new Date(2025, 0, 9, 9, 10),
      size: 3_000_000,
    },
    {
      name: "mistral:3b",
      digest: "STUB",
      modifiedAt: new Date(2025, 0, 9, 9, 10),
      size: 3_000_000,
    },
  ]

  // Stub data
  const activeModels: string[] = [
    "llama3.2:3b",
  ]
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
    <div class="flex flex-col gap-2 px-2">
      {#each models as { name, size, modifiedAt }, i (name)}
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
            {#if activeModels.includes(name)}
              <StatusDot status="success" />
            {/if}
          </div>

          <div class="flex items-center text-xs gap-1">
            <span>{convert(size, "bytes").to("best", "imperial").toString(2)}</span>
            <div class="flex-grow"></div>
            <span>Modified at {dayjs(modifiedAt).fromNow()}</span>
          </div>
        </div>
      {/each}
    </div>
  </ScrollArea>
</div>
