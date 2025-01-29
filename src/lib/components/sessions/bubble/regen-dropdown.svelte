<script lang="ts">
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu"
  import type { ChatBubble } from "$lib/models/session"
  import { selectedSessionModel } from "$lib/stores/models"
  import { regenerate } from "$lib/utils/regen"
  import { RefreshCwIcon } from "lucide-svelte"

  let { data }: {
    data: ChatBubble,
  } = $props()

  let modelCandidates = $derived([...new Set([
    ...data.model ? [data.model] : [],
    ...$selectedSessionModel ? [$selectedSessionModel] : [],
  ])])

  let dropdownNeeded = $derived(modelCandidates.length > 1)
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
