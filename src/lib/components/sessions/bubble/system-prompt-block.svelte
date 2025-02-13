<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "$lib/components/ui/collapsible"
  import { parseMarkdown } from "$lib/markdown"
  import { cn } from "$lib/utils"
  import { ChevronDownIcon } from "lucide-svelte"

  let { content }: { content: string } = $props()

  let open = $state(false)
</script>

<Collapsible class="bg-muted text-muted-foreground rounded px-2 py-2 md:px-3" bind:open>
  <CollapsibleTrigger class="text-sm font-bold w-full flex items-center">
    <span class="grow text-start">System prompt</span>
    <div>
      <ChevronDownIcon
        class={cn(
          "size-4 transition duration-200",
          open && "-rotate-180",
        )}
      />
    </div>
  </CollapsibleTrigger>

  <CollapsibleContent class="text-sm">
    {#snippet child({ props, open })}
      {#if open}
        <div
          {...props}
          class={cn(
            "marked-area my-1 pl-5 pr-2 py-2 text-muted-foreground bg-muted/50 text-sm rounded",
          )}
        >
          {#await parseMarkdown(content) then genHtml}
            {@html genHtml}
          {/await}
        </div>
      {/if}
    {/snippet}
  </CollapsibleContent>
</Collapsible>
