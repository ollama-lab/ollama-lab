<script lang="ts">
  import Header from "./chat-panel/header.svelte"
  import ChatFeeds from "./chat-panel/chat-feeds.svelte"
  import PromptInput from "./chat-panel/prompt-input.svelte"
</script>

<div class="flex flex-col w-full h-full">
  <Header />
  <div class="flex-grow">
    <ChatFeeds />
  </div>
  <PromptInput />
</div>
