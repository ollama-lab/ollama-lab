<script lang="ts">
  import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "$lib/components/ui/dropdown-menu"
  import { EllipsisVerticalIcon } from "lucide-svelte"
  import DeletionDialog from "./operation-dropdown/deletion-dialog.svelte"
  import DropdownMenuItem from "$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte"

  let { sessionId }: { sessionId: number } = $props()
</script>

<DropdownMenu>
  <DropdownMenuTrigger
    onclick={ev => ev.stopPropagation()}
    class=""
  >
    <EllipsisVerticalIcon class="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent class="flex flex-col">
    <DropdownMenuItem class="flex bg-destructive hover:bg-red-800 cursor-pointer">
      <DeletionDialog />
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
