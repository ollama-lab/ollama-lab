<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"
  import { currentSessionId } from "$lib/stores/sessions"

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
    <div class="flex flex-col gap-2">
    </div>
  </ScrollArea>
</div>
