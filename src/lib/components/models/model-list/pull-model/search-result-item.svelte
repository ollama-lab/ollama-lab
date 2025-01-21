<script lang="ts">
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import TagBadge from "$lib/components/custom-ui/tag-badge.svelte"
  import { CommandLinkItem } from "$lib/components/ui/command"
  import { modelList } from "$lib/stores/model-list"
  import type { SearchItem } from "$lib/stores/model-search"
  import { pullModelTasks } from "$lib/stores/pull-model"
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
  let fullName = $derived(`${item.name}:${selected}`)

  let downloadedAlready = $derived($modelList.filter(({ name }) => name === fullName).length > 0)
  let downloading = $derived(Object.keys($pullModelTasks).includes(fullName))

  let downloadInitiated = $state(false)

  $effect(() => {
    if (downloading) {
      downloadInitiated = false
    }
  })
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
          title={downloadedAlready ? "Model downloaded already" : "Pull model"}
          onclick={(ev) => {
            ev.stopPropagation()
            downloadInitiated = true
            onInitiatePull?.(fullName)
          }}
          disabled={downloadedAlready}
        >
          {#if downloadInitiated || downloading}
            <Loader2Icon class="size-4 animate-spin" />
          {:else}
            <CloudDownloadIcon class={cn("size-4", downloadedAlready && "text-muted-foreground")} />
          {/if}
        </MicroButton>
      </div>
    </div>
  </div>
</CommandLinkItem>
