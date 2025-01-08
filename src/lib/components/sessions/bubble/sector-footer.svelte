<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import SentDate from "./sent-date.svelte"

  let { data }: { data: ChatBubble } = $props()
</script>

<span class="text-end text-xs text-muted-foreground space-x-2">
  {#if data.dateSent}
    <SentDate date={data.dateSent} />
  {/if}
</span>
