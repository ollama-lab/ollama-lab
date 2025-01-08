<script lang="ts">
  import { cn } from "$lib/utils"
  import type { Snippet } from "svelte"

  let { children, name, href, active, onClick }: {
    children?: Snippet
    name: string
    href?: string
    active?: boolean
    onClick?: () => void
  } = $props()
</script>

<div class={cn("group flex rounded cursor-pointer", active && "bg-secondary")}>
  <div class="py-1">
    <hr
      class={cn(
        "border h-full border-transparent rounded-full",
        active ? "border-primary" : "group-hover:border-secondary",
      )}
    />
  </div>
  <a
    href={href ?? "#"}
    aria-label={name}
    title={name}
    draggable={false}
    class={cn(
      "p-3",
    )}
    onclick={onClick}
  >
    {@render children?.()}
  </a>
</div>
