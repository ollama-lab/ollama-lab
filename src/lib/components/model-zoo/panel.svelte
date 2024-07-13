<script lang="ts">
  import type { ModelEntry } from "$lib/models/models";
  import ModelDashboard from "./model-dashboard.svelte";
  import Welcome from "./panel/welcome.svelte"

  export let entry: ModelEntry | null
</script>

<div class="w-full h-dvh flex flex-col">
  {#if entry}
    <ModelDashboard {entry} />
  {:else}
    <Welcome />
  {/if}
</div>
