<script lang="ts">
  import Header from "./chat-panel/header.svelte"
  import ChatFeeds from "./chat-panel/chat-feeds.svelte"
  import PromptInput from "./chat-panel/prompt-input.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import RegenFooter from "./chat-panel/regen-footer.svelte"
  import { setContext } from "svelte"

  let feedsRoot = $state<HTMLElement | null>(null)

  setContext("scroll-down", (height: number) => {
    feedsRoot?.children.item(0)?.scrollTo(0, height)
  })
</script>

<div class="flex flex-col w-full h-full">
  <Header />
  <ScrollArea
    bind:ref={feedsRoot}
    class="flex-grow px-2 py-2 w-full max-w-screen-lg mx-auto"
  >
    <ChatFeeds />

    <RegenFooter />
  </ScrollArea>
  <div class="max-w-screen-lg w-full mx-auto">
    <PromptInput />
  </div>
</div>
