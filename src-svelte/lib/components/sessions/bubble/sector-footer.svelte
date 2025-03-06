<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import AssistantBubbleToolbar from "./assistant-bubble-toolbar.svelte"
  import SentDate from "./sent-date.svelte"
  import Status from "./status.svelte"
  import UserBubbleToolbar from "./user-bubble-toolbar.svelte"

  let {
    data,
    editingMode = $bindable(),
  }: {
    data: ChatBubble
    editingMode: boolean
  } = $props()

  let isProcessing = $derived(data.status === "sent" || data.status === "not sent")
</script>

<div
  class={cn(
    "flex items-center gap-2 text-xs text-muted-foreground",
  )}
>
  {#if data.role === "assistant" && data.status !== "sent"}
    <Status status={data.status} role={data.role} />
  {/if}
  {#if data.role === "assistant" && isProcessing}
    <AssistantBubbleToolbar {data} />
  {/if}
  {#if data.dateSent}
    <SentDate date={data.dateSent} />
  {/if}

  {#if data.role === "user" && isProcessing && !editingMode}
    <UserBubbleToolbar bind:editingMode />
  {/if}
</div>
