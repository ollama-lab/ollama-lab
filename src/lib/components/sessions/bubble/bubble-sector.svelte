<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import SectorFooter from "./sector-footer.svelte"
  import Bubble from "./bubble.svelte"

  let { data }: { data: ChatBubble } = $props()
</script>

{#if data.role !== "system"}
  <div
    class={cn(
      "flex py-1 gap-2 items-center",
      data.role === "user" ? "place-content-end" : "place-content-start",
    )}
  >
    <div class="flex flex-col">
      <Bubble {data} />
      <SectorFooter {data} />
    </div>

    {#if data.role === "user" && data.status === "sending"}
      <Loading />
    {/if}
  </div>
{/if}
