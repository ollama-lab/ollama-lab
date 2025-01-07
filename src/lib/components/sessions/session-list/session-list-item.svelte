<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { currentSessionId } from "$lib/stores/sessions"
  import { cn } from "$lib/utils"
  import OperationDropdown from "./operation-dropdown.svelte"

  let { sessionId, title }: {
    sessionId: number
    title: string
  } = $props()

  let renameMode = $state<boolean>(false)

  let optimisticTitle = $state<string | undefined>()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events  -->
<div
  class={cn(
    "flex items-center px-3 py-2 rounded cursor-pointer min-h-12",
    $currentSessionId === sessionId ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
  )}
  onclick={() => $currentSessionId = sessionId}
  role="button"
  tabindex={sessionId}
  ondblclick={() => renameMode = true}
>
  <div class="flex-grow select-none truncate text-sm">
    {#if renameMode}
      <Input
        defaultvalue={title}
        onblur={(ev) => {
          renameMode = false

          const newTitle = ev.currentTarget.value.trim()
          if (newTitle.length < 1 || newTitle === title) {
            return
          }

          optimisticTitle = title

          try {
            // Logic
          } finally {
            optimisticTitle = undefined
          }
        }}
        class="text-foreground"
      />
    {:else}
      {optimisticTitle ?? title}
    {/if}
  </div>
  <div class="flex-shrink-0 flex items-center">
    <OperationDropdown {sessionId} />
  </div>
</div>
