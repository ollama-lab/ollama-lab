<script lang="ts">
  import { chatHistory } from "$lib/stores/chats"
  import { cn } from "$lib/utils"
  import { BubbleSector } from "../bubble"
  import Hints from "./chat-feeds/hints.svelte"

  let loaded = $state(false)

  $effect(() => {
    if (!loaded) return

    return () => {
      loaded = false
    }
  })
</script>

<div
  class={cn(
    "flex flex-col",
    $chatHistory === undefined && "h-full place-content-center items-center",
  )}
>
  {#if $chatHistory !== undefined}
    {#key `chat-history-session-${$chatHistory.session}`}
      {#each $chatHistory.chats as bubble (bubble.id)}
        <BubbleSector data={bubble} />
      {/each}
    {/key}
  {:else}
    <div class="text-center space-y-4">
      <span class="select-none font-bold text-2xl">Hello there! 👋</span>
      <Hints />
    </div>
  {/if}
</div>
