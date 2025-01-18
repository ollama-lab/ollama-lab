<script lang="ts" module>
  export const modelDuplicationSchema = z.object({
    model: z.string().min(1),
  })

  export type ModelDuplicationSchema = typeof modelDuplicationSchema
</script>

<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { FormButton, FormControl, FormField, FormFieldErrors } from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { CopyIcon } from "lucide-svelte"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { superForm } from "sveltekit-superforms"
  import { zod } from "sveltekit-superforms/adapters"
  import { z } from "zod"
  import { copyModel } from "$lib/commands/models"
  import { modelList } from "$lib/stores/model-list"
  import { currentModel } from "$lib/stores/models"
  import { toast } from "svelte-sonner"

  let { model }: {
    model: string
  } = $props()

  let open = $state(false)

  const form = superForm({ model: "" }, {
    validators: zod(modelDuplicationSchema),
    onSubmit: async ({ formData }) => {
      const newModelName = formData.get("model")?.toString()
      if (!newModelName) {
        return
      }

      await copyModel(model, newModelName)
      await modelList.reload()

      const modelName = newModelName.split(":").length < 2 ? `${newModelName}:latest` : newModelName
      currentModel.set(modelName)
      open = false

      toast.success(`Model copied to ${modelName}`)
    }
  })

  const { form: formData, tainted, isTainted, submitting, enhance } = form
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

    {#if $submitting}
      <Loading content="Proceeding..." />
    {:else}
      <form class="flex flex-col gap-4" method="POST" use:enhance>
        <FormField {form} name="model">
          <FormControl>
            {#snippet children({ props })}
              <Input
                {...props}
                bind:value={$formData.model}
                placeholder="New model name"
              />
              <FormFieldErrors />
            {/snippet}
          </FormControl>
        </FormField>

        <DialogFooter>
          <DialogClose class={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
          <FormButton
            disabled={!isTainted($tainted)}
            type="submit"
          >
            Proceed
          </FormButton>
        </DialogFooter>
      </form>
    {/if}
  </DialogContent>
</Dialog>
