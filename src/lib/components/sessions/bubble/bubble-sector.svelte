<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import SectorFooter from "./sector-footer.svelte"
  import Bubble from "./bubble.svelte"
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar"

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
      <div class="flex">
        {#if data.role === "assistant"}
          <Avatar>
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        {/if}

        <div
          class={cn(
            "flex flex-col",
            data.role === "user" && "items-end",
          )}>
          <Bubble {data} />
          <SectorFooter {data} />
        </div>
      </div>
    </div>

    {#if data.role === "user" && data.status === "sending"}
      <Loading />
    {/if}
  </div>
{/if}
