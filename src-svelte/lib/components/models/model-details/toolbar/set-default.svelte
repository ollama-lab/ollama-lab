<script lang="ts">
  import { setDefaultModel } from "$lib/commands/models"
  import { Button } from "$lib/components/ui/button"
  import { defaultModel } from "$lib/stores/models"
  import { toast } from "svelte-sonner"

  let { model }: { model: string } = $props()
</script>

<Button
  onclick={() => {
    // Optimistic update
    const prevModel = $defaultModel
    defaultModel.set(model)
    setDefaultModel(model)
      .catch((err) => {
        if (prevModel) {
          defaultModel.set(prevModel)
          return
        }
        toast.error(err)
      })
  }}
>
  Set default
</Button>
