<script lang="ts">
  import type { Feed } from "$lib/models/feed"
    import GuestBubble from "./bubbles/guest-bubble.svelte";
    import HostBubble from "./bubbles/host-bubble.svelte";

  export let feeds: Feed[]
</script>

<div class="flex flex-col gap-4 px-4 py-2 overflow-y-scroll">
  {#each feeds as feed}
    {#if feed.user}
      <GuestBubble {feed} />
    {:else if feed.model}
      <HostBubble {feed} />
    {/if}
  {/each}
</div>
