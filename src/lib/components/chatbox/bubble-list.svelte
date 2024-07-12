<script lang="ts">
  import type { Feed } from "$lib/models/feed";
  import ChatBubble from "./chat-bubble.svelte";

  export let feeds: Feed[]
</script>

<div class="flex flex-col gap-4 px-4 py-2">
  {#each feeds as feed}
    <ChatBubble {feed} />
  {/each}
</div>
