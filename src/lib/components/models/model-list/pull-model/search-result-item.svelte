<script lang="ts">
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import TagBadge from "$lib/components/custom-ui/tag-badge.svelte"
  import { CommandLinkItem } from "$lib/components/ui/command"
  import type { SearchItem } from "$lib/stores/model-search"
  import { cn } from "$lib/utils"
  import { CloudDownloadIcon, Loader2Icon } from "lucide-svelte"

  let {
    item,
    onInitiatePull,
  }: {
    item: SearchItem
    onInitiatePull?: (model: string) => void
  } = $props()

  let selected = $state<string>("latest")
</script>

<CommandLinkItem
  onclick={() => selected = "latest"}
>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col">
      <span class="font-bold">{item.name}</span>
      <span class="whitespace-pre-wrap flex-wrap">
        {item.description}
      </span>
    </div>
    <div class="flex gap-2 w-full">
      <div class="flex gap-2">
        {#each item.tags as { type, content } (content)}
          {#if type === "category"}
            <TagBadge class="bg-fuchsia-200/80 dark:bg-fuchsia-900/80">{content}</TagBadge>
          {:else if type === "parameter"}
            <TagBadge
              class={cn(
                "bg-sky-200/80 dark:bg-sky-900/80 hover:bg-sky-400 dark:hover:bg-sky-700 cursor-pointer",
                selected === content && "bg-sky-400 dark:bg-sky-700",
              )}
              onclick={(ev) => {
                ev.stopPropagation()
                selected = content
              }}
            >
              {content}
            </TagBadge>
          {/if}
        {/each}
      </div>
      <div class="flex-grow"></div>
      <div class="flex gap-2 lg:gap-4 place-content-end text-xs items-center">
        <span>Selected: {selected}</span>
        <MicroButton
          title="Pull model"
          onclick={(ev) => {
            ev.stopPropagation()
          }}
        >
          <CloudDownloadIcon class="size-4" />
          <Loader2Icon class="size-4 animate-spin" />
        </MicroButton>
      </div>
    </div>
  </div>
</CommandLinkItem>
