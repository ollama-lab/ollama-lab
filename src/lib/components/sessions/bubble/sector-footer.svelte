<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import AssistantBubbleToolbar from "./assistant-bubble-toolbar.svelte"
  import SentDate from "./sent-date.svelte"
  import Status from "./status.svelte"

  let { data }: { data: ChatBubble } = $props()
</script>

<div
  class={cn(
    "flex items-center gap-2 text-xs text-muted-foreground",
  )}
>
  {#if data.role === "assistant" && data.status !== "sent"}
    <Status status={data.status} role={data.role} />
  {/if}
  {#if data.role === "assistant" && (data.status === "sent" || data.status === "not sent")}
    <AssistantBubbleToolbar {data} />
  {/if}
  {#if data.dateSent}
    <SentDate date={data.dateSent} />
  {/if}
</div>
