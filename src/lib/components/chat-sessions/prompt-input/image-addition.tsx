import { createSignal } from "solid-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { HardDriveIcon, ImagesIcon } from "lucide-solid";
import { openUrl } from "@tauri-apps/plugin-opener";
import { launchPromptImageSelector } from "~/lib/utils/add-images";

export function ImageAddition() {
  const [open, setOpen] = createSignal(false);

  const onMultimodalHelpLinkClick = () => {
    openUrl("https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)#Multimodality");
  };

  const onDeviceSelectorButtonClick = async () => {
    await launchPromptImageSelector();
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={Button<"button">}
        variant="outline"
        size="icon"
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
                on:click={onMultimodalHelpLinkClick}
              >
                What is a multimodal model?
              </button>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={onDeviceSelectorButtonClick}
          >
            <HardDriveIcon />
            From this device
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
