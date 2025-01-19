<script lang="ts">
  import { platform } from "@tauri-apps/plugin-os"
  import { fly } from "svelte/transition"

  let {
    searchEntered = false,
    searchInitiated = false,
  }: {
    searchEntered?: boolean
    searchInitiated?: boolean
  } = $props()

  const os = platform()
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
      <span>
        {#if os === "macos" || os === "ios"}
          <!-- Mac keyboard -->
          <kbd>{"\u2318" /* Command key symbol */} Enter</kbd>
        {:else}
          <!-- PC keyboard -->
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        {/if}
      </span>
      <span>Pull entered anyway</span>
    </span>
  </div>
{/if}
