<script lang="ts">
  import { Loader2Icon } from "lucide-svelte"

  let { content }: {
    content?: string
  } = $props()

</script>

<span class="flex place-items-center gap-2">
  <Loader2Icon class="animate-spin" />
  {content}
</span>
