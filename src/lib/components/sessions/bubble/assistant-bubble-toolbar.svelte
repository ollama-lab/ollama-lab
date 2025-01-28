<script lang="ts">
  import MicroButton from "$lib/components/custom-ui/micro-button.svelte"
  import { CopyIcon } from "lucide-svelte"
  import RegenDropdown from "./regen-dropdown.svelte"
  import type { ChatBubble } from "$lib/models/session"

  let { data }: {
    data: ChatBubble,
  } = $props()
</script>

<div class="flex gap-2 items-center">
  <MicroButton
    title="Copy Markdown"
    onclick={() => {
      navigator.clipboard.writeText(data.content)
    }}
  >
    <CopyIcon class="size-4" />
  </MicroButton>

  <RegenDropdown {data} />
</div>
