<script lang="ts">
  import { CloudDownloadIcon } from "lucide-svelte"
  import Button from "../ui/button/button.svelte"
  import { ScrollArea } from "../ui/scroll-area"

</script>

<div class="w-full h-full flex flex-col">
  <div class="py-4 px-3 flex-shrink-0 flex place-items-center">
    <h2 class="text-lg font-bold select-none flex-grow">Models</h2>
    <div class="flex-shrink-0">
      <Button
        size="icon"
        variant="outline"
        title="Pull model"
        onclick={() => {
        }}
      >
        <CloudDownloadIcon />
      </Button>
    </div>
  </div>
  <ScrollArea class="flex-grow">
    <div class="flex flex-col gap-2 px-2">
    </div>
  </ScrollArea>
</div>
