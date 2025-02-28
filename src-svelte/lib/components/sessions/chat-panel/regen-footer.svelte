<script lang="ts">
  import { lastChat } from "$lib/stores/chats"
  import RegenButton from "./regen-button.svelte"
</script>

{#if $lastChat?.role === "user" || $lastChat?.status === "not sent"}
  <div class="bottom-0 w-full flex place-content-center py-4 pointer-events-none">
    <div class="pointer-events-auto">
      <RegenButton />
    </div>
  </div>
{/if}
