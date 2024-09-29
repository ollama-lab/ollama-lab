<script lang="ts">
  import GuestBubble from "./bubbles/guest-bubble.svelte"
  import HostBubble from "./bubbles/host-bubble.svelte"
  import { IconReload } from "@tabler/icons-svelte"
  import { chatBubbles } from "$lib/stores/chats"

  $: feeds = $chatBubbles
</script>

<div class="flex flex-col gap-4 px-4 py-2 overflow-y-scroll">
  {#each feeds as feed}
    {#if feed.role === "user"}
      <GuestBubble {feed} />
    {:else if feed.role === "assistant"}
      <HostBubble {feed} />
    {/if}
  {/each}

  {#if feeds[feeds.length - 1].content === ""}
    <button class="btn variant-filled-primary place-self-center flex place-items-center">
      <IconReload class="size-5" />
      <span>Regenerate</span>
    </button>
  {/if}
</div>
