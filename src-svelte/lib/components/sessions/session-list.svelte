<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { sessions } from "$lib/stores/sessions"
  import SessionListItem from "./session-list/session-list-item.svelte"
  import { chatHistory } from "$lib/stores/chats"

</script>

<div class="w-full h-full flex flex-col">
  <div class="sticky py-4 px-3 flex-shrink-0 flex place-items-center bg-background/50 backdrop-blur-lg">
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
  <div class="flex-grow overflow-y-scroll">
    <div class="flex flex-col gap-2 px-2">
      {#if $sessions}
        {#each $sessions as { id, title } (id)}
          <SessionListItem sessionId={id} {title} />
        {/each}
      {/if}
    </div>
  </div>
</div>
