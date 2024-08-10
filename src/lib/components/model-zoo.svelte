<script lang="ts">
  import ModelFinder from "./model-zoo/model-finder.svelte"
  import Panel from "./model-zoo/panel.svelte";

  let selectedModel: string | null = null
</script>

<div class="h-full flex">
  <div class="h-full">
    <ModelFinder bind:selectedModel />
  </div>
  <div class="size-full">
    <Panel {selectedModel} />
  </div>
</div>
