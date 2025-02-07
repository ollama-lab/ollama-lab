<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import { Loading } from "$lib/components/ui/command"
  import { parseMarkdown } from "$lib/markdown"

  let { data }: { data: ChatBubble } = $props()

  let dataHTML = $state("")

  $effect(() => {
    parseMarkdown(data.content).then(html => dataHTML = html)
  })
</script>

<div
  class={cn(
    "marked-area",
    "py-2",
    data.role === "user" && "bg-secondary text-secondary-foreground px-5 rounded-2xl",
    data.role === "assistant" && data.status === "sending" && "has-type-block",
  )}
>
  {@html dataHTML}
  {#if data.status === "preparing"}
    <Loading />
  {/if}
</div>
