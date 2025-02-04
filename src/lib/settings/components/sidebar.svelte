<script lang="ts">
  import { cn } from "$lib/utils"

  let { value: items, activeKey = $bindable() }: {
    value: { [key: string]: string }
    activeKey: string
  } = $props()

  $effect(() => {
    if (!activeKey) {
      activeKey = Object.keys(items)[0]
    }
  })
</script>

<div class="px-2 py-2 text-sm">
  <ul class="flex flex-col gap-2">
    {#each Object.entries(items) as [key, value] (`sidebar-item-${key}`)}
      <li class={cn(
        "text-muted-foreground",
        activeKey === key && "text-secondary-foreground",
      )}>
        <a
          class="block w-full"
          href={`#${key}`}
          onclick={() => activeKey = key}
        >
          {value}
        </a>
      </li>
    {/each}
  </ul>
</div>
