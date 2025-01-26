<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { currentSessionId } from "$lib/stores/sessions"
  import { cn } from "$lib/utils"
  import { BubbleSector } from "../bubble"
  import Hints from "./chat-feeds/hints.svelte"

  let historialBubbles = $state<ChatBubble[]>([])
  let continuedBubbles = $state<ChatBubble[]>([])

  let bubbles = $derived([...historialBubbles, ...continuedBubbles])
  let loaded = $state(false)

  $effect(() => {
    if (!loaded) return

    return () => {
      loaded = false
      if (historialBubbles.length > 0) historialBubbles = []
      if (continuedBubbles.length > 0) continuedBubbles = [] 
    }
  })
</script>

<div
  class={cn(
    "flex flex-col",
    $currentSessionId === undefined && "h-full place-content-center items-center",
  )}
>
  {#if $currentSessionId !== undefined}
    {#key `chat-history-session-${$currentSessionId}`}
      {#each bubbles as bubble (bubble.id)}
        <BubbleSector data={bubble} />
      {/each}
    {/key}
  {:else}
    <div class="text-center">
      <span class="select-none font-bold text-2xl">Hello there! 👋</span>
      <Hints />
    </div>
  {/if}
</div>
