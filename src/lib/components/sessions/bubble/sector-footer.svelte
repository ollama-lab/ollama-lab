<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import SentDate from "./sent-date.svelte"
  import Status from "./status.svelte"

  let { data }: { data: ChatBubble } = $props()
</script>

<span
  class={cn(
    "text-xs text-muted-foreground space-x-2",
  )}
>
  {#if data.role === "assistant" && data.status !== "sent"}
    <Status status={data.status} role={data.role} />
  {/if}
  {#if data.dateSent}
    <SentDate date={data.dateSent} />
  {/if}
</span>
