<script lang="ts">
  import { cn } from "$lib/utils"
  import { activeModels, currentModel, defaultModel } from "$lib/stores/models"
  import StatusDot from "$lib/components/custom-ui/status-dot.svelte"
  import { Badge } from "$lib/components/ui/badge";
  import { convert } from "convert"
  import RelativeTime from "$lib/components/custom-ui/relative-time.svelte"
  import { Progress } from "$lib/components/ui/progress"
  import { Loader2Icon, TriangleAlertIcon, XIcon } from "lucide-svelte"
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
    import { pullModelTasks } from "$lib/stores/pull-model";

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
    status?: "inProgress" | "failure"
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
      {#if status === "failure"}
        <MicroButton
          title="Cancel"
          onclick={() => pullModelTasks.clear(name)}
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
      {#if completedSize !== undefined}
        <span title={`${completedSize.toLocaleString()} bytes`}>
          {convert(completedSize, "bytes").to("best", "imperial").toString(2)}
        </span>
      {/if}
      {#if completeProgress}
        /
      {/if}
      {#if totalSize !== undefined}
        <span title={`${totalSize.toLocaleString()} bytes`}>
          {convert(totalSize, "bytes").to("best", "imperial").toString(2)}
        </span>
      {/if}
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
