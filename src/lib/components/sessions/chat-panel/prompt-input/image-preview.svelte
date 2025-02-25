<script lang="ts">
  import { getThumbnailBase64 } from "$lib/commands/image"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { Button } from "$lib/components/ui/button"
  import { TrashIcon } from "lucide-svelte"
  import { cn } from "$lib/utils"

  let { paths, onDelete }: {
    paths: string[]
    onDelete?: (index: number) => void
  } = $props()

  let images = $derived(paths.map((path) => getThumbnailBase64(path)))
</script>

<div class="flex gap-2 overflow-x-auto">
  {#each images as image, i}
    <div>
      <div
        class={cn(
          "group relative flex flex-col gap-1 overflow-auto cursor-pointer border border-border px-1 py-1 min-w-40",
        )}
      >
        <div class="max-h-[200px]">
          {#await image}
            <Skeleton class="w-[200px] h-[200px]" />
          {:then image}
            <img src={`data:${image.mime};base64,${image.base64}`} alt={image.path} title={image.path}>
          {/await}
        </div>
        <Button
          variant="destructive"
          class="absolute top-0 right-0 rounded-full size-8 opacity-0 group-hover:opacity-100"
          size="icon"
          onclick={async (ev) => {
            ev.stopPropagation()
            onDelete?.(i)
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  {/each}
</div>
