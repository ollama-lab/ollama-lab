<script lang="ts">
  import { cn } from "$lib/utils"
  import { activeModels, currentModel, defaultModel } from "$lib/stores/models"
  import StatusDot from "$lib/components/custom-ui/status-dot.svelte"
  import { Badge } from "$lib/components/ui/badge";
  import RelativeTime from "$lib/components/custom-ui/relative-time.svelte"
  import { Progress } from "$lib/components/ui/progress"
  import { Loader2Icon, TriangleAlertIcon, XIcon } from "lucide-svelte"
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import ProgressSize from "$lib/components/custom-ui/progress-size.svelte"
  import { pullModelTasks } from "$lib/stores/pull-model"
  import { emit } from "@tauri-apps/api/event"
  import { toEventString } from "$lib/utils/strings"
  import { toast } from "svelte-sonner"

  let {
    name,
    message,
    totalSize,
    completedSize,
    modifiedAt,
    status,
    index: i,
  }: {
    name: string
    message?: string
    totalSize?: number
    completedSize?: number
    modifiedAt?: Date
    status?: "inProgress" | "failure" | "canceled"
    index: number,
  } = $props()

  let selected = $derived($currentModel === name)
  let isDefault = $derived($defaultModel === name)

  let completeProgress = $derived(completedSize !== undefined && totalSize !== undefined)

</script>

<!-- svelte-ignore a11y_click_events_have_key_events  -->
<div
  class={cn(
    "flex flex-col rounded cursor-pointer overflow-hidden",
    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
  )}
  role="button"
  tabindex={i}
  onclick={(ev) => {
    currentModel.set(name)
    ev.stopPropagation()
  }}
>
  <div
    class="flex flex-col px-2 py-2 gap-2"
  >
    <div class="flex items-center select-none gap-1">
      {#if status === "failure"}
        <TriangleAlertIcon class="size-4" />
      {/if}
      {#if status === "inProgress"}
        <Loader2Icon class="size-4 animate-spin" />
      {/if}
      <span class="font-bold">{name}</span>
      {#if $activeModels.map(item => item.name).includes(name)}
        <StatusDot status="success" />
      {/if}

      {#if isDefault}
        <Badge
          variant={selected ? "secondary" : "default"}
          title="Newly created sessions will use this model by default."
        >
          Default
        </Badge>
      {/if}

      <div class="flex-grow"></div>
      {#if status}
        <MicroButton
          title={status === "canceled" ? "Remove" : "Cancel"}
          onclick={() => {
            if (status === "canceled" || status === "failure") {
              pullModelTasks.clear(name)
            } else {
              const promise = emit(`cancel-pull/${toEventString(name)}`)

              toast.promise(promise, {
                loading: "Cancel request sent",
                success: "Pulling task canceled",
                error: (err) => `Error: ${err}`,
              })
            }
          }}
        >
          <XIcon class="size-4" />
        </MicroButton>
      {/if}
    </div>

    <div class="flex items-center text-xs gap-1">
      {#if message}
        <span class="truncate">{message}</span>
      {/if}
      {#if modifiedAt !== undefined}
        <span class="flex gap-1">
          Modified
          <RelativeTime date={modifiedAt} />
        </span>
      {/if}
      <div class="flex-grow"></div>
      <ProgressSize {completedSize} {totalSize} />
    </div>
  </div>
  <Progress
    value={status === "inProgress" ? (completeProgress ? completedSize! / totalSize! * 100 : null) : undefined}
    class={cn(
      "h-1 rounded-none bg-transparent",
      selected && "invert",
    )}
  />
</div>
