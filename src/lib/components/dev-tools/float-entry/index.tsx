import { CodeIcon } from "lucide-solid";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { SwitchControl, SwitchDescription, SwitchLabel, SwitchRoot } from "../../ui/switch";
import { getDevOptions, setDevOptions } from "~/lib/contexts/globals/dev-tools/dev-mode";
import { Component } from "solid-js";

const FloatEntry: Component = () => {
  return (
    <Dialog>
      <DialogTrigger as={Badge} class="absolute bottom-0 right-0 z-[500] flex bg-background text-foreground border border-border rounded items-center gap-1 hover:bg-secondary cursor-pointer">
        <CodeIcon class="size-4" />
        <span class="text-xs">Dev</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Developer Mode Options</DialogTitle>
        </DialogHeader>
        
        <div class="flex flex-col gap-2">
          <SwitchRoot
            checked={getDevOptions("rerenderFlash")}
            onChange={(checked) => setDevOptions("rerenderFlash", checked)}
            class="flex gap-2 items-center"
          >
            <SwitchControl />
            <div class="flex flex-col">
              <SwitchLabel>Re-rendering flash</SwitchLabel>
              <SwitchDescription class="text-xs text-muted-foreground">
                Show a flash effect when the Markdown contents in chats are re-rendered.
              </SwitchDescription>
            </div>
          </SwitchRoot>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FloatEntry;
