<script lang="ts">
  import TagBadge from "$lib/components/custom-ui/tag-badge.svelte"
  import { CommandGroup, CommandLinkItem } from "$lib/components/ui/command"
  import type { SearchResult } from "$lib/stores/model-search"

  let {
    searchResult,
    isPullNext = false,
    onInitiatePull,
  }: {
    searchResult: SearchResult,
    isPullNext?: boolean
    onInitiatePull?: (model: string) => void
  } = $props()
</script>

<CommandGroup heading="Search result">
  {#each searchResult.result as { name, tags, description } (name)}
    <CommandLinkItem
      class="cursor-pointer"
      onclick={() => {
      }}
    >
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <span class="font-bold">{name}</span>
          <span class="whitespace-pre-wrap flex-wrap">
            {description}
          </span>
        </div>
        <div class="flex gap-2">
          {#each tags as { type, content } (content)}
            {#if type === "category"}
              <TagBadge class="bg-fuchsia-200/80 dark:bg-fuchsia-900/80">{content}</TagBadge>
            {:else if type === "parameter"}
              <TagBadge
                class="bg-sky-200/80 dark:bg-sky-900/80 hover:bg-sky-400 dark:hover:bg-sky-700 cursor-pointer"
                onclick={onInitiatePull ? (ev) => {
                  ev.stopPropagation()
                } : undefined}
              >
                {content}
              </TagBadge>
            {/if}
          {/each}
        </div>
      </div>
    </CommandLinkItem>
  {/each}
</CommandGroup>
