<script lang="ts">
  import ModelFinder from "./model-zoo/model-finder.svelte"
  import Panel from "./model-zoo/panel.svelte";

  let selectedModel: string | null = null
  let reloadRequired: boolean = false
</script>

<div class="h-full flex">
  <div class="h-full">
    <ModelFinder bind:selectedModel bind:reloadRequired />
  </div>
  <div class="size-full">
    <Panel {selectedModel} bind:reloadRequired />
  </div>
</div>
