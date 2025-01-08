<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "$lib/components/ui/dialog"
  import { cn } from "$lib/utils"
  import { TrashIcon } from "lucide-svelte"

</script>

<Dialog>
  <DialogTrigger
    class={cn(
      "w-full flex gap-2 items-center text-red-600 dark:text-red-400 rounded px-1 py-1",
    )}
  >
    <TrashIcon class="size-4" />
    Delete
  </DialogTrigger>

  <DialogContent>
    <DialogHeader class="font-bold text-lg text-red-600 dark:text-red-400">
      Confirm deletion
    </DialogHeader>

    <div>
      The session will be <b>permanently</b> removed.
    </div>

    <DialogFooter>
      <DialogClose class={buttonVariants({ variant: "secondary" })} autofocus>
        Cancel
      </DialogClose>
      <Button variant="destructive">
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
