<script lang="ts">
  import { chatHistory } from "$lib/stores/chats"
  import RegenButton from "./regen-button.svelte"

  let lastChat = $derived($chatHistory?.chats.at(-1))
</script>

{#if lastChat?.role === "user" || lastChat?.status === "not sent"}
  <div class="absolute bottom-0 w-full flex place-content-center py-4 pointer-events-none">
    <div class="pointer-events-auto">
      <RegenButton />
    </div>
  </div>
{/if}
