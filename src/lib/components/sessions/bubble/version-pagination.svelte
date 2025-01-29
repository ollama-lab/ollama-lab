<script lang="ts">
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import { chatHistory } from "$lib/stores/chats"
  import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-svelte"

  let { versions, current }: {
    versions: number[]
    current: number
  } = $props()

  let page = $derived(versions.findIndex(id => id === current) + 1)
  let switching = $state(false)
</script>

{#if versions.length > 1}
  <div class="flex gap-1 items-center text-muted-foreground font-bold text-xs">
    <MicroButton
      disabled={page <= 1}
      class="disabled:opacity-0"
      onclick={() => {
        if (switching) return

        switching = true
        chatHistory.switchBranch(versions[page - 2])
          .finally(() => switching = false)
      }}
    >
      <ChevronLeftIcon class="size-3" />
    </MicroButton>

    {#if switching}
      <Loader2Icon class="size-3 animate-spin" />
    {:else}
      <span>{page}</span>
      /
      <span>{versions.length}</span>
    {/if}

    <MicroButton
      disabled={page >= versions.length}
      class="disabled:opacity-0"
      onclick={() => {
        if (switching) return

        switching = true
        chatHistory.switchBranch(versions[page])
          .finally(() => switching = false)
      }}
    >
      <ChevronRightIcon class="size-3" />
    </MicroButton>
  </div>
{/if}
