<script lang="ts">
  import { PlaceholderTitle } from "."

  let { model }: {
    model?: string
  } = $props()
</script>

{#if model}
  <div class="flex flex-col h-full">
  </div>
{:else}
  <div class="flex flex-col place-items-center place-content-center h-full">
    <PlaceholderTitle />
  </div>
{/if}
