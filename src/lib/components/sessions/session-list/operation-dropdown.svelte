<script lang="ts">
  import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "$lib/components/ui/dropdown-menu"
  import { EllipsisVerticalIcon, SquarePenIcon } from "lucide-svelte"
  import DeletionDialog from "./operation-dropdown/deletion-dialog.svelte"

  let {
    sessionId,
    onEdit,
  }: {
    sessionId: number
    onEdit?: () => void
  } = $props()

  let open = $state(false)
</script>

<DropdownMenu bind:open>
  <DropdownMenuTrigger
    onclick={ev => ev.stopPropagation()}
    class=""
  >
    <EllipsisVerticalIcon class="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent class="text-sm">
    <button
      class="w-full flex gap-2 items-center rounded px-1 py-1 hover:bg-secondary"
      onclick={() => {
        onEdit?.()
        open = false
      }}
    >
      <SquarePenIcon class="size-4" />
      Rename
    </button>
    <DeletionDialog {sessionId} />
  </DropdownMenuContent>
</DropdownMenu>
