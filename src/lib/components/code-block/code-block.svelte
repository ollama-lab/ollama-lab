<script lang="ts">
  import type { Snippet } from "svelte"
  import { Card, CardContent, CardHeader } from "../ui/card"
  import { Button } from "../ui/button"
  import { ScrollArea } from "../ui/scroll-area"

  let { lang, children }: {
    lang?: string
    children?: Snippet
  } = $props()
</script>

<Card>
  <CardHeader class="flex flex-row items-center">
    <span>{lang}</span>
    <span class="flex-grow"></span>
    <Button variant="outline">
      Copy
    </Button>
  </CardHeader>
  <CardContent>
    <ScrollArea>
      <pre class="whitespace-pre-wrap break-all">
        <code>
          {@render children?.()}
        </code>
      </pre>
    </ScrollArea>
  </CardContent>
</Card>
