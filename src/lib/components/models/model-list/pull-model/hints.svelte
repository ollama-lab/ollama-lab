<script lang="ts">
    import { fly } from "svelte/transition";

  let {
    searchEntered = false,
    searchInitiated = false,
  }: {
    searchEntered?: boolean
    searchInitiated?: boolean
  } = $props()
</script>

{#if searchEntered}
  <div class="flex gap-2 md:gap-4 lg:gap-6 text-xs px-2 py-2" transition:fly={{ x: -50, y: 0, duration: 300 }}>
      <span class="flex gap-2 items-center">
        <span class="z-[1]"><kbd>Enter</kbd></span>
        {#key `search-hint-initiated-${searchInitiated}`}
          <span in:fly={{ x: 40 * (searchInitiated ? -1 : 1), y: 0, duration: 300 }}>
            {#if searchInitiated}
              Pull selected
            {:else}
              Search
            {/if}
          </span>
        {/key}
      </span>
    <span class="flex gap-2 items-center">
      <span><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>
      <span>Pull entered anyway</span>
    </span>
  </div>
{/if}
