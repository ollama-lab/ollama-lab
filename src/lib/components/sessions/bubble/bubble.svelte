<script lang="ts" module>
  import DOMPurify from "isomorphic-dompurify"
  import { marked } from "marked"

  export async function parseMarkdown(markdown: string): Promise<string> {
    return DOMPurify.sanitize(await marked.parse(markdown, {
      silent: true,
      async: true,
      gfm: true,
    }))
  }
</script>

<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"

  let { data }: { data: ChatBubble } = $props()

  let dataHTML = $state("")

  $effect(() => {
    parseMarkdown(data.content).then(html => dataHTML = html)
  })
</script>

<div
  class={cn(
    "marked-area",
    "px-5 py-2 rounded-2xl",
    data.role === "user" && "bg-secondary text-secondary-foreground px-5 py-2 rounded-2xl",
  )}
>
  {@html dataHTML}
</div>
