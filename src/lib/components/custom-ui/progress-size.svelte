<script lang="ts">
  import { cn } from "$lib/utils"
  import convert from "convert"

  let { completedSize, totalSize, class: className }: {
    completedSize?: number
    totalSize?: number
    class?: string
  } = $props()

  let completeProgress = $derived(completedSize !== undefined && totalSize !== undefined)
</script>

<span class={cn(className)}>
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
</span>
