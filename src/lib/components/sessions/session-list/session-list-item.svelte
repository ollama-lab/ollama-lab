<script lang="ts">
  import { Input } from "$lib/components/ui/input"
  import { chatHistory } from "$lib/stores/chats"
  import { cn } from "$lib/utils"
  import { toast } from "svelte-sonner"
  import OperationDropdown from "./operation-dropdown.svelte"
  import { Loader2Icon } from "lucide-svelte"

  let { sessionId, title }: {
    sessionId: number
    title: string | null
  } = $props()

  let renameMode = $state<boolean>(false)

  let optimisticTitle = $state<string | null>()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events  -->
<div
  class={cn(
    "flex items-center px-3 py-2 rounded cursor-pointer min-h-12",
    $chatHistory?.session === sessionId ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
  )}
  onclick={() => {
    try {
      chatHistory.setSessionId(sessionId)
    } catch (err) {
      toast.error(`Error: ${err}`)
    }
  }}
  role="button"
  tabindex={sessionId}
  ondblclick={() => renameMode = true}
>
  <div class="flex-grow select-none truncate text-sm flex gap-2 items-center">
    {#if renameMode}
      <Input
        defaultvalue={title ?? ""}
        onblur={(ev) => {
          renameMode = false

          const newTitle = ev.currentTarget.value.trim()
          if (newTitle.length < 1 || newTitle === title) {
            return
          }

          optimisticTitle = title

          try {
            // TODO: Logic
          } finally {
            optimisticTitle = undefined
          }
        }}
        class="text-foreground"
      />
    {:else}
      {optimisticTitle ?? title ?? "New Chat"}
      {#if $chatHistory?.session === sessionId && $chatHistory?.loading}
        <Loader2Icon class="size-4 animate-spin" />
      {/if}
    {/if}
  </div>
  {#if !renameMode}
    <div class="flex-shrink-0 flex items-center">
      <OperationDropdown {sessionId} onEdit={() => renameMode = true} />
    </div>
  {/if}
</div>
