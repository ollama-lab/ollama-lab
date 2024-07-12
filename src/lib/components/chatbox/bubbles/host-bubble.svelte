<script lang="ts">
  import type { Feed } from "$lib/models/feed";

  export let feed: Feed
</script>

<div class="flex flex-row place-self-end">
  <div>
    {feed.content}
  </div>
</div>
