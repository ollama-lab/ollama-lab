<script lang="ts">
  import type { ChatBubble } from "$lib/models/session"

  let { data }: { data: ChatBubble } = $props()
</script>

<div class="bg-secondary text-secondary-foreground px-5 py-2 rounded-2xl">
  {data.content}
</div>
