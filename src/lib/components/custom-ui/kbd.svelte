<script lang="ts">
  import { cn } from "$lib/utils"
  import type { Snippet } from "svelte"

  let {
    children,
    class: className,
  }: {
    children?: Snippet
    class?: string
  } = $props()
</script>

<kbd
  class={cn(
    "bg-muted text-muted-foreground rounded px-1",
    className,
  )}
>
  {@render children?.()}
</kbd>
