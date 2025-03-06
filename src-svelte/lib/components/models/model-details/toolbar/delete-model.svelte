<script lang="ts">
  import { deleteModel } from "$lib/commands/models"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { modelList } from "$lib/stores/model-list"
  import { currentModel } from "$lib/stores/models"
  import { cn } from "$lib/utils"
  import { TrashIcon } from "lucide-svelte"
  import { toast } from "svelte-sonner"

  let { model }: { model: string } = $props()

  let open = $state(false)
  let submitting = $state(false)
</script>

<Dialog bind:open>
  <DialogTrigger
    class={cn(buttonVariants({ variant: "destructive", size: "icon" }))}
    title="Delete"
  >
    <TrashIcon />
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle class="text-red-700 dark:text-red-500">
        {#if submitting}
          <Loading content={"Deleting model..."} />
        {:else}
          Confirm deletion
        {/if}
      </DialogTitle>
    </DialogHeader>
    {#if !submitting}
      <div>
        The model will be <b>permanently</b> removed.
      </div>
      <DialogFooter>
        <DialogClose
          class={cn(buttonVariants({ variant: "secondary" }))}
        >
          Cancel
        </DialogClose>
        <Button
          variant="destructive"
          onclick={() => {
            submitting = true
            const deletionPromise = deleteModel(model)
              .then(() => {
                open = false
                currentModel.set(undefined)
                modelList.reload()
              })
              .finally(() => submitting = false)

            toast.promise(deletionPromise, {
              loading: "Deleting model...",
              success: "Model successfully deleted",
              error: (err) => {
                return `Deletion failed: ${err}`
              },
            })
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    {/if}
  </DialogContent>
</Dialog>
