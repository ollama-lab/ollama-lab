<script lang="ts">
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu"
  import type { ChatBubble } from "$lib/models/session"
  import { chatHistory } from "$lib/stores/chats"
  import { selectedSessionModel } from "$lib/stores/models"
  import { RefreshCwIcon } from "lucide-svelte"
  import { getContext } from "svelte"
  import { get } from "svelte/store"

  let { data }: {
    data: ChatBubble,
  } = $props()

  let modelCandidates = $derived([...new Set([
    ...data.model ? [data.model] : [],
    ...$selectedSessionModel ? [$selectedSessionModel] : [],
  ])])

  let dropdownNeeded = $derived(modelCandidates.length > 1)

  const scrollDownFn = getContext<() => void | undefined>("scroll-down")

  export async function regenerate(chatId: number, model?: string): Promise<void> {
    const ch = get(chatHistory)
    if (!ch) {
      return
    }

    await chatHistory.regenerate(chatId, model, {
      onScrollDown: scrollDownFn,
    })
  }
</script>

{#key `regen-dropdown-${data.id}-${dropdownNeeded}`}
  <DropdownMenu>
    <DropdownMenuTrigger
      title="Regenerate"
      onclick={async (ev) => {
        if (dropdownNeeded) {
          return
        }

        ev.preventDefault()
        await regenerate(data.id)
      }}
    >
      <RefreshCwIcon class="size-4" />
    </DropdownMenuTrigger>

    {#if dropdownNeeded}
      <DropdownMenuContent>
        {#each modelCandidates as name (name)}
          <DropdownMenuItem
            class="cursor-pointer"
            onclick={async () => {
              await regenerate(data.id, name)
            }}
          >
            Use {name}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    {/if}
  </DropdownMenu>
{/key}
