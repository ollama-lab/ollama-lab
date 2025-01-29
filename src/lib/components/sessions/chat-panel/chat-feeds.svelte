<script lang="ts">
  import { chatHistory } from "$lib/stores/chats"
  import { modelList } from "$lib/stores/model-list"
  import { defaultModel, selectedSessionModel } from "$lib/stores/models"
  import { cn } from "$lib/utils"
  import { getContext } from "svelte"
  import { BubbleSector } from "../bubble"
  import Hints from "./chat-feeds/hints.svelte"

  let root = $state<HTMLDivElement | undefined>()

  $effect(() => {
    if (!$selectedSessionModel) {
      const fallback = $defaultModel ?? $modelList.at(0)?.name
      if (fallback) {
        selectedSessionModel.set(fallback)
      }
    }
  })

  const scrollDownFn: ((height: number) => void) | undefined = getContext("scroll-down")

  $effect(() => {
    const chats = $chatHistory?.chats
    const status = chats?.at(-1)?.status

    if (status === "preparing" || status === "sending") {
      if (root) {
        scrollDownFn?.(root.scrollHeight)
      }
    }
  })
</script>

<div
  bind:this={root}
  class={cn(
    "flex flex-col pr-2",
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
