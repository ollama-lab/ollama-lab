<script lang="ts">
  import { cn } from "$lib/utils"
  import type { Snippet } from "svelte"
  import type { MouseEventHandler } from "svelte/elements"

  let {
    children,
    class: className,
    onclick,
  }: {
    children?: Snippet
    class?: string
    onclick?: MouseEventHandler<HTMLSpanElement>,
  } = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events  -->
<span
  class={cn(
    "text-xs px-2 py-1 rounded-lg",
    className,
  )}
  onclick={onclick}>
  {@render children?.()}
</span>
