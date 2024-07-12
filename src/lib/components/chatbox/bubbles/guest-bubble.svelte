<script lang="ts">
  import type { Feed } from "$lib/models/feed"
  import { parseMarkdown } from "$lib/markdown"
  import { Avatar } from "@skeletonlabs/skeleton";

  export let feed: Feed
</script>

<div class="flex flex-row place-self-end gap-4 place-items-center">
  <div class="flex flex-col">
    <span class="place-self-end text-sm font-semibold select-none">{feed.user?.username ?? "You"}</span>
    <div class="markdown-view bg-primary-200 dark:bg-primary-800 px-4 py-2 rounded-2xl rounded-tr-none">
      <!-- HTML sanitized, no worries! -->
      {@html parseMarkdown(feed.content)}
    </div>
    <span class="text-xs place-self-end select-none">{feed.date.toLocaleString()}</span>
  </div>
  <div class="place-self-stretch">
    <Avatar width="w-10" initials={feed.user?.username} background="bg-tertiary-700" />
  </div>
</div>
