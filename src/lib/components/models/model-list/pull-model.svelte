<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { currentModel } from "$lib/stores/models"
  import { CloudDownloadIcon } from "lucide-svelte"

</script>

<Button
  size="icon"
  variant="outline"
  title="Pull model"
  onclick={() => {
    currentModel.set(undefined)
  }}
>
  <CloudDownloadIcon />
</Button>
