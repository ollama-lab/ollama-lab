<script lang="ts">
  import type { ModelEntry } from "$lib/models/models"
  import { runningModels, modelList } from "$lib/stores/models"
  import ModelDashboard from "./model-dashboard.svelte"
  import Welcome from "./panel/welcome.svelte"

  export let selectedModel: string | null

  let entry: ModelEntry | null

  $: {
    const model = selectedModel ? $modelList.find(m => m.name === selectedModel) : undefined
    if (model) {
      const runModel = $runningModels.find(m => m.name === model.name)

      entry = {
        ...model,
        status: runModel ? {
          expires_at: runModel.expires_at,
          size_vram: runModel.size_vram,
        } : null,
      }
    } else {
      entry = null
    }
  }
</script>

<div class="w-full h-dvh flex flex-col">
  {#if entry}
    <ModelDashboard {entry} />
  {:else}
    <Welcome />
  {/if}
</div>
