<script lang="ts">
  import ChatFeed from "./chatbox/chat-feed.svelte";
import SessionList from "./chatbox/session-list.svelte"

  let activeSession: number | null = null
</script>

<div class="h-full flex">
  <div class="flex flex-col z-[2] shadow-lg">
    <div class="flex-auto flex">
      <SessionList bind:activeSession />
    </div>
  </div>
  <div class="flex-auto flex">
    <ChatFeed bind:activeSession />
  </div>
</div>
