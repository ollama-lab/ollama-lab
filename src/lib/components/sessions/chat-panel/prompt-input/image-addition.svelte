<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { cn } from "$lib/utils"
  import { launchPromptImageSelector } from "$lib/utils/add-images"
  import { HardDriveIcon, ImagesIcon } from "lucide-svelte"
</script>

<Dialog>
  <DialogTrigger
    class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
    type="button"
    title="Add images"
  >
    <ImagesIcon />
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select image source</DialogTitle>
      <DialogDescription>
        NOTE: Only <b>multimodal</b> models can read images.
      </DialogDescription>
    </DialogHeader>

    <div class="flex flex-col gap-2">
      <Button
        variant="outline"
        onclick={() => launchPromptImageSelector()}
      >
        <HardDriveIcon />
        From this device 
      </Button>
    </div>
  </DialogContent>
</Dialog>
