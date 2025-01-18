<script lang="ts" module>
  export const modelDuplicationSchema = z.object({
    model: z.string().min(1),
  })

  export type ModelDuplicationSchema = typeof modelDuplicationSchema
</script>

<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button"
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"
  import { FormButton, FormControl, FormField } from "$lib/components/ui/form"
  import { Input } from "$lib/components/ui/input"
  import { cn } from "$lib/utils"
  import { CopyIcon } from "lucide-svelte"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import { superForm } from "sveltekit-superforms"
  import { zod } from "sveltekit-superforms/adapters"
  import { z } from "zod"
  import { copyModel } from "$lib/commands/models"
  import { modelList } from "$lib/stores/model-list"

  let { model }: {
    model: string
  } = $props()

  const form = superForm({ model: "" }, {
    validators: zod(modelDuplicationSchema),
    onSubmit: async ({ formData }) => {
      await copyModel(model, formData.get("model")?.toString() ?? "")
      await modelList.reload()
    }
  })

  const { form: formData, tainted, isTainted, submitting } = form
</script>

<Dialog>
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
      <form class="flex flex-col gap-4">
        <FormField {form} name="model">
          <FormControl>
            {#snippet children({ props })}
              <Input
                {...props}
                bind:value={$formData.model}
                placeholder="New model name"
              />
            {/snippet}
          </FormControl>
        </FormField>

        <DialogFooter>
          <DialogClose class={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
          <FormButton disabled={!isTainted($tainted)}>
            Proceed
          </FormButton>
        </DialogFooter>
      </form>
    {/if}
  </DialogContent>
</Dialog>
