<script lang="ts">
  import type { FeedStatus } from "$lib/models/feed"
  import { fade } from "svelte/transition"

  export let status: FeedStatus

  $: visible = status !== "completed"
</script>

{#if visible}
  <span class="font-light text-xs uppercase text-secondary-700 dark:text-secondary-300" transition:fade={{ delay: 2000 }}>
    {#if status === "processing"}
      Processing
    {:else if status === "generating"}
      Generating
    {:else if status === "completed"}
      Generation complete
    {/if}
  </span>
{/if}
