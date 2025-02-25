<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { cn } from "$lib/utils"
  import { launchPromptImageSelector } from "$lib/utils/add-images"
  import { openUrl } from "@tauri-apps/plugin-opener"
  import { HardDriveIcon, ImagesIcon } from "lucide-svelte"

  let open = $state(false)
</script>

<Dialog bind:open>
  <DialogTrigger
    class={cn(buttonVariants({ variant: "outline", size: "icon" }))}
    type="button"
    title="Add images"
  >
    <ImagesIcon />
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select image source</DialogTitle>
      <DialogDescription>
        <p>NOTE: Only <b>multimodal</b> models can read images.</p>
        <p>
          <button
            class="hover:underline text-blue-500"
            onclick={async () => {
              await openUrl("https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)#Multimodality")
            }}
          >
            What is a multimodal model?
          </button>
        </p>
      </DialogDescription>
    </DialogHeader>

    <div class="flex flex-col gap-2">
      <Button
        variant="outline"
        onclick={async () => {
          await launchPromptImageSelector()
          open = false
        }}
      >
        <HardDriveIcon />
        From this device 
      </Button>
    </div>
  </DialogContent>
</Dialog>
