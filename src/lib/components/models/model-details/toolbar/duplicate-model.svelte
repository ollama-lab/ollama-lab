<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { CopyIcon } from "lucide-svelte"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { copyModel } from "$lib/commands/models"
  import { modelList } from "$lib/stores/model-list"
  import { currentModel } from "$lib/stores/models"
  import { toast } from "svelte-sonner"

  let { model }: {
    model: string
  } = $props()

  let open = $state(false)

  let submitting = $state(false)
</script>

<Dialog bind:open>
  <DialogTrigger
    class={cn(buttonVariants({ variant: "outline", size: "icon" }))}
    title="Duplicate model"
  >
    <CopyIcon />
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Duplicate model</DialogTitle>
      <DialogDescription>
        Enter the new model name for the copy.
      </DialogDescription>
    </DialogHeader>

    {#if submitting}
      <Loading content="Proceeding..." />
    {:else}
      <form
        class="flex flex-col gap-4"
        onsubmit={async (ev) => {
          ev.preventDefault()

          submitting = true
          const formData = new FormData(ev.currentTarget)

          const newModelName = formData.get("model")?.toString()
          if (!newModelName) {
            return
          }

          try {
            await copyModel(model, newModelName)
            await modelList.reload()
          } finally {
            submitting = false
            open = false
          }

          const modelName = newModelName.split(":").length < 2 ? `${newModelName}:latest` : newModelName
          currentModel.set(modelName)

          toast.success(`Model copied to ${modelName}`)
        }}
      >
        <Input
          name="model"
          placeholder="New model name"
          required
        />

        <DialogFooter>
          <DialogClose class={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
          <Button type="submit">
            Proceed
          </Button>
        </DialogFooter>
      </form>
    {/if}
  </DialogContent>
</Dialog>
