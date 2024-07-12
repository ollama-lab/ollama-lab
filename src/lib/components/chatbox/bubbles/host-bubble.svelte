<script lang="ts">
  import { parseMarkdown } from "$lib/markdown";
  import type { Feed } from "$lib/models/feed";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { IconPointFilled } from "@tabler/icons-svelte";
  import StatusIndicator from "../status-indicator.svelte";

  export let feed: Feed

</script>

<div class="flex flex-row place-self-start place-items-center gap-4">
  <div class="place-self-stretch">
    <Avatar width="w-10" src="/favicon.svg" background="bg-white" class="p-2" />
  </div>
  <div class="flex flex-col">
    <div class="place-self-start flex gap-1 place-items-center">
      <span class="text-sm font-semibold">LLM {feed.model?.model ?? "unknown"}:{feed.model?.variant ?? "unknown"}</span>
      <StatusIndicator status={feed.status ?? "completed"} />
    </div>
    <div class={`markdown-view generated-text-block ${feed.status === "generating" ? "generating" : ""} bg-surface-200 dark:bg-surface-800 px-4 py-2 rounded-2xl rounded-tl-none`}>
      <!-- HTML sanitized, no worries! -->
      {@html parseMarkdown(feed.content)}
      {#if feed.status !== "completed"}
        <IconPointFilled class="inline-block" />
      {/if}
    </div>
    <span class="text-xs place-self-start">{feed.date.toLocaleString()}</span>
  </div>
</div>
