<script lang="ts">
  import type { Feed } from "$lib/models/feed";
  import GuestBubble from "./bubbles/guest-bubble.svelte";
  import HostBubble from "./bubbles/host-bubble.svelte";

  export let feed: Feed
</script>

{#if feed.sender === "user"}
  <GuestBubble {feed} />
{:else}
  <HostBubble {feed} />
{/if}
