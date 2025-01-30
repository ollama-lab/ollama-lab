<script lang="ts">
  import { chatHistory } from "$lib/stores/chats"
  import RegenButton from "./regen-button.svelte"
</script>

{#if $chatHistory?.chats.at(-1)?.role === "user" || $chatHistory?.chats.at(-1)?.status === "not sent"}
  <div class="absolute bottom-0 w-full flex place-content-center py-4 pointer-events-none">
    <div class="pointer-events-auto">
      <RegenButton />
    </div>
  </div>
{/if}
