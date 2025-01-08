<script lang="ts">
  import Header from "./chat-panel/header.svelte"
  import ChatFeeds from "./chat-panel/chat-feeds.svelte"
  import PromptInput from "./chat-panel/prompt-input.svelte"
  import { ScrollArea } from "../ui/scroll-area"
</script>

<div class="flex flex-col w-full h-full">
  <Header />
  <ScrollArea class="flex-grow px-2 py-2 w-full max-w-screen-lg mx-auto">
    <ChatFeeds />
  </ScrollArea>
  <div class="max-w-screen-lg w-full mx-auto">
    <PromptInput />
  </div>
</div>
