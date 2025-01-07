<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import { currentSessionId } from "$lib/stores/sessions"
  import type { Session } from "$lib/models/session"
  import SessionListItem from "./session-list/session-list-item.svelte"

  // Placeholder sessions
  const sessions: Session[] = [
    {
      id: 1,
      title: "Why is the sky blue?",
    },
    {
      id: 2,
      title: "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong title",
    },
  ]
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
          $currentSessionId = undefined
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  </div>
  <ScrollArea class="flex-grow">
    <div class="flex flex-col gap-2 px-2">
      {#each sessions as { id, title } (id)}
        <SessionListItem sessionId={id} {title} />
      {/each}
    </div>
  </ScrollArea>
</div>
