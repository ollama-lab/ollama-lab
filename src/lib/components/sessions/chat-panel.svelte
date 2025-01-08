<script lang="ts">
  import Header from "./chat-panel/header.svelte"
  import ChatFeeds from "./chat-panel/chat-feeds.svelte"
  import PromptInput from "./chat-panel/prompt-input.svelte"
</script>

<div class="flex flex-col w-full h-full">
  <Header />
  <div class="flex-grow px-2 py-2 max-w-screen-lg">
    <ChatFeeds />
  </div>
  <div class="max-w-screen-lg">
    <PromptInput />
  </div>
</div>
