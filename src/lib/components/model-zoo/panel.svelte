<script lang="ts">
  import type { Model, RunningStatus } from "$lib/models/models"
  import { runningModels, modelList } from "$lib/stores/models"
  import ModelDashboard from "./model-dashboard.svelte"
  import Welcome from "./panel/welcome.svelte"

  export let selectedModel: string | null
  export let reloadRequired: boolean

  let modelInfo: [Model, RunningStatus | null] | undefined

  $: {
    const model = selectedModel ? $modelList.find(m => m.name === selectedModel) : undefined
    if (model) {
      const runModel = $runningModels.find(m => m.name === model.name)

      modelInfo = [model, runModel ? {
        expires_at: runModel.expires_at,
        size_vram: runModel.size_vram,
      } : null]
    } else {
      modelInfo = undefined
    }
  }
</script>

<div class="w-full h-dvh flex flex-col">
  {#if modelInfo}
    <ModelDashboard model={modelInfo[0]} status={modelInfo[1]} bind:reloadRequired />
  {:else}
    <Welcome />
  {/if}
</div>
