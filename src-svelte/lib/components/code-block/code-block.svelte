<script lang="ts">
  import type { Snippet } from "svelte"
  import { Card, CardContent, CardHeader } from "../ui/card"
  import { Button } from "../ui/button"
  import { CheckIcon, CopyIcon } from "lucide-svelte"

  let { lang, children }: {
    lang?: string
    children?: Snippet
  } = $props()

  let containerRef = $state<HTMLElement>()

  let showCopied = $state(false)
  let timerId: number | undefined = undefined

  $effect(() => { if (showCopied) {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        showCopied = false
        timerId = undefined
      }, 2000)
    }

    return () => {
      clearTimeout(timerId)
    }
  })
</script>

<Card>
  <CardHeader class="flex flex-row items-center">
    <span class="text-xs">{lang}</span>
    <span class="flex-grow"></span>
    <Button
      variant="outline"
      disabled={showCopied}
      onclick={() => {
        if (containerRef) {
          navigator.clipboard.writeText(containerRef.innerText)
          showCopied = true
        }
      }}
      size="icon"
    >
      {#if showCopied}
        <CheckIcon />
      {:else}
        <CopyIcon />
      {/if}
    </Button>
  </CardHeader>
  <CardContent>
    <div class="overflow-y-scroll">
      <pre class="whitespace-pre-wrap break-all text-sm"><code bind:this={containerRef}>{@render children?.()}</code></pre>
    </div>
  </CardContent>
</Card>
