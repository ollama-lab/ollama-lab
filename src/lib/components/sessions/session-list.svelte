<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import { sessions } from "$lib/stores/sessions"
  import SessionListItem from "./session-list/session-list-item.svelte"
  import { chatHistory } from "$lib/stores/chats"

</script>

<div class="w-full h-full flex flex-col">
  <div class="py-4 px-3 flex-shrink-0 flex place-items-center">
    <h2 class="text-lg font-bold select-none flex-grow">Sessions</h2>
    <div class="flex-shrink-0">
      <Button
        size="icon"
        variant="outline"
        title="New session"
        onclick={() => {
          chatHistory.clear()
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  </div>
  <ScrollArea class="flex-grow">
    <div class="flex flex-col gap-2 px-2">
      {#if $sessions}
        {#each $sessions as { id, title } (id)}
          <SessionListItem sessionId={id} title={title ?? "New Chat"} />
        {/each}
      {/if}
    </div>
  </ScrollArea>
</div>
