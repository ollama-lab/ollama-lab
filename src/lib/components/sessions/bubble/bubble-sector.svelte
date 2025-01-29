<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"
  import { cn } from "$lib/utils"
  import Loading from "$lib/components/custom-ui/loading.svelte"
  import SectorFooter from "./sector-footer.svelte"
  import Bubble from "./bubble.svelte"
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar"
  import { SquarePenIcon, TriangleAlertIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import VersionPagination from "./version-pagination.svelte"

  let { data }: { data: ChatBubble } = $props()
</script>

{#if data.role !== "system"}
  <div
    class={cn(
      "group/bubble-sector flex py-1 gap-2 items-center",
      data.role === "user" ? "place-content-end" : "place-content-start",
    )}
  >
    <div class="flex flex-col">
      <div class="flex gap-2">
        {#if data.role === "assistant"}
          <Avatar>
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        {/if}

        {#if data.role === "user"}
          <div class="flex items-center gap-2">
            <Button
              class={cn(
                "opacity-0 group-hover/bubble-sector:opacity-100",
              )}
              variant="ghost"
              size="icon"
              title="Edit prompt"
            >
              <SquarePenIcon />
            </Button>
          </div>
        {/if}

        <div
          class={cn(
            "flex flex-col gap-1",
            data.role === "user" && "items-end",
          )}
        >
          <span class="text-xs font-bold">
            {#if data.role === "assistant"}
              {data.model}
            {:else if data.role === "user"}
              You
            {/if}
          </span>
          <Bubble {data} />

          {#if data.versions}
            <div class="flex gap-2 items-center">
              <VersionPagination versions={data.versions} current={data.id} />
            </div>
          {/if}

          <SectorFooter {data} />
        </div>
      </div>
    </div>

    {#if data.role === "user"}
      {#if data.status === "sending"}
        <Loading />
      {:else if data.status === "not sent"}
        <TriangleAlertIcon class="text-yellow-600" />
      {/if}
    {/if}
  </div>
{/if}
