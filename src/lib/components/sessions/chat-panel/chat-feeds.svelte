<script lang="ts">
  import { chatHistory } from "$lib/stores/chats"
  import { modelList } from "$lib/stores/model-list"
  import { defaultModel, selectedSessionModel } from "$lib/stores/models"
  import { cn } from "$lib/utils"
  import { BubbleSector } from "../bubble"
  import Hints from "./chat-feeds/hints.svelte"

  let root = $state<HTMLDivElement | undefined>()

  let { autoScroll = $bindable() }: {
    autoScroll: boolean
  } = $props()

  $effect(() => {
    if (!$selectedSessionModel) {
      const fallback = $defaultModel ?? $modelList.at(0)?.name
      if (fallback) {
        selectedSessionModel.set(fallback)
      }
    }
  })

  $effect(() => {
    const chats = $chatHistory?.chats
    const status = chats?.at(-1)?.status

    if (status === "preparing" || status === "sending") {
      if (root && autoScroll) {
        root.parentElement?.scrollTo(0, root.scrollHeight)
      }
    }
  })
</script>

<div
  bind:this={root}
  class={cn(
    "flex flex-col flex-wrap text-wrap",
    $chatHistory === undefined && "h-full place-content-center items-center",
  )}
  onwheel={(ev) => {
    if (root) {
      if (ev.deltaY < 0) {
        autoScroll = false
      } else {
        const scrollArea = ev.currentTarget.parentElement
        if (scrollArea) {
          if (ev.currentTarget.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <= 0) {
            autoScroll = true
          }
        }
      }
    }
  }}
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
