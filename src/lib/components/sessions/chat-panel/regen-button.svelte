<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { regenerateLast } from "$lib/utils/regen"
  import { RefreshCcwDotIcon } from "lucide-svelte"
</script>

<Button
  class="flex items-center gap-2"
  onclick={async () => {
    await regenerateLast()
  }}
>
  <RefreshCcwDotIcon />
  Regenerate
</Button>
