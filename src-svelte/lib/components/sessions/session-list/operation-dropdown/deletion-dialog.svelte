<script lang="ts">
  import { deleteSession } from "$lib/commands/sessions"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "$lib/components/ui/dialog"
  import { chatHistory } from "$lib/stores/chats"
  import { sessions } from "$lib/stores/sessions"
  import { cn } from "$lib/utils"
  import { TrashIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  let { sessionId }: { sessionId: number } = $props()

  let open = $state(false)

  let proceeding = $state(false)
</script>

<Dialog bind:open>
  <DialogTrigger
    class={cn(
      "w-full flex gap-2 items-center text-red-600 dark:text-red-400 rounded px-1 py-1 hover:bg-secondary",
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
      The session and its chat history will be <b>permanently</b> deleted. This operation cannot be undone.
    </div>

    <DialogFooter>
      <DialogClose class={buttonVariants({ variant: "secondary" })} autofocus>
        Cancel
      </DialogClose>
      <Button
        variant="destructive"
        onclick={() => {
          proceeding = true
          deleteSession(sessionId)
            .then(() => {
              open = false

              if ($chatHistory?.session === sessionId) {
                chatHistory.clear()
              }

              toast.success("Session successfully deleted")
              sessions.reload()
            })
            .catch((err) => toast.error(`Error: ${err}`))
            .finally(() => proceeding = false)
        }}
      >
        {#if proceeding}
          <Loading content="Deleting..." />
        {:else}
          Confirm
        {/if}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
