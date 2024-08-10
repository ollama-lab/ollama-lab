<script lang="ts">
  import type { Feed } from "$lib/models/feed"
  import Reload from "@tabler/icons-svelte/icons/reload"
  import GuestBubble from "./bubbles/guest-bubble.svelte"
  import HostBubble from "./bubbles/host-bubble.svelte"
  import { chatBubbles } from "$lib/stores/chats"

  let feeds: Feed[] = $chatBubbles
</script>

<div class="flex flex-col gap-4 px-4 py-2 overflow-y-scroll">
  {#each feeds as feed}
    {#if feed.user}
      <GuestBubble {feed} />
    {:else if feed.model}
      <HostBubble {feed} />
    {/if}
  {/each}

  {#if !feeds[feeds.length - 1].model}
    <button class="btn variant-filled-primary place-self-center flex place-items-center">
      <Reload class="size-5" />
      <span>Regenerate</span>
    </button>
  {/if}
</div>
