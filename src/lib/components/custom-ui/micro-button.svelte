<script lang="ts">
  import { cn } from "$lib/utils"
  import type { WithElementRef } from "bits-ui"
  import type { HTMLButtonAttributes } from "svelte/elements"

  let {
    class: className,
    children,
    title,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> = $props()
</script>

<button
  aria-label={title ?? "button"}
  class={cn(
    "text-xs",
    className,
  )}
  {title}
  {...restProps}
>
  {@render children?.()}
</button>
