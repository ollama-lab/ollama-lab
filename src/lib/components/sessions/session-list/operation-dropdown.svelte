<script lang="ts">
  import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "$lib/components/ui/dropdown-menu"
  import { EllipsisVerticalIcon } from "lucide-svelte"
  import DeletionDialog from "./operation-dropdown/deletion-dialog.svelte"

  let { sessionId }: { sessionId: number } = $props()
</script>

<DropdownMenu>
  <DropdownMenuTrigger
    onclick={ev => ev.stopPropagation()}
    class=""
  >
    <EllipsisVerticalIcon class="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DeletionDialog {sessionId} />
  </DropdownMenuContent>
</DropdownMenu>
