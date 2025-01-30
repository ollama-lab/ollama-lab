<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "$lib/components/ui/collapsible"
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import convert from "convert"
  import { ChevronDownIcon, Loader2Icon } from "lucide-svelte"
  import { fly } from "svelte/transition"
  import { parseMarkdown } from "./bubble.svelte"

  let { data }: { data: ChatBubble } = $props()
  
  let thoughtForString = $derived(data.thoughtFor ? convert(data.thoughtFor, "milliseconds").to("best").toString(3) : "some time")

  let open = $state(false)

  let dataHTML = $state("")

  $effect(() => {
    parseMarkdown(data.thoughts ?? "").then(html => dataHTML = html)
  })
</script>

{#if data.thinking}
  <div class="flex items-center gap-2 text-sm text-muted-foreground -z-[1]" in:fly={{ x: -25, y: 0 }}>
    <Loader2Icon class="size-4 animate-spin duration-500" />
    Thinking...
  </div>
{:else if data.thoughts}
  <div in:fly={{ x: -25, y: 0 }}>
    <Collapsible bind:open>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Thought for <span>{thoughtForString}</span>
        </span>
        <CollapsibleTrigger title={open ? "Hide thoughts" : "Expand thoughts"}>
          <ChevronDownIcon
            class={cn(
              "size-4 duration-300",
              open && "-rotate-180",
            )}
          />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div
              {...props}
              class={cn(
                "marked-area my-1 pl-7 pr-2 py-2 text-muted-foreground bg-muted/50 text-sm rounded",
              )}
              transition:fly={{ x: 0, y: -20 }}
            >
              {@html dataHTML}
            </div>
          {/if}
        {/snippet}
      </CollapsibleContent>
    </Collapsible>
  </div>
{/if}
