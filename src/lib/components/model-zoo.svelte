<script lang="ts">
  import type { Model, RunningModel, ModelEntry } from "$lib/models/models";
  import ModelFinder from "./model-zoo/model-finder.svelte"
  import Panel from "./model-zoo/panel.svelte";

  let selectedModel: string | null = null

  let allModels: Model[] = [
    {
      "name": "codellama:13b",
      "modified_at": new Date("2023-11-04T14:56:49.277302595-07:00"),
      "size": 7365960935,
      "digest": "9f438cb9cd581fc025612d27f7c1a6669ff83a8bb0ed86c94fcf4c5440555697",
      "details": {
        "format": "gguf",
        "family": "llama",
        "families": null,
        "parameter_size": "13B",
        "quantization_level": "Q4_0"
      }
    },
    {
      "name": "llama3:latest",
      "modified_at": new Date("2023-12-07T09:32:18.757212583-08:00"),
      "size": 3825819519,
      "digest": "fe938a131f40e6f6d40083c9f0f430a515233eb2edaa6d72eb85c50d64f2300e",
      "details": {
        "format": "gguf",
        "family": "llama",
        "families": null,
        "parameter_size": "7B",
        "quantization_level": "Q4_0"
      }
    },
    {
      "name": "mistral:latest",
      "modified_at": new Date("2023-12-07T09:32:18.757212583-08:00"),
      "size": 5137025024,
      "digest": "2ae6f6dd7a3dd734790bbbf58b8909a606e0e7e97e94b7604e0aa7ae4490e6d8",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": [
          "llama"
        ],
        "parameter_size": "7.2B",
        "quantization_level": "Q4_0"
      },
    }
  ]

  let runningModels: RunningModel[] = [
    {
      "name": "mistral:latest",
      "model": "mistral:latest",
      "size": 5137025024,
      "digest": "2ae6f6dd7a3dd734790bbbf58b8909a606e0e7e97e94b7604e0aa7ae4490e6d8",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": [
          "llama"
        ],
        "parameter_size": "7.2B",
        "quantization_level": "Q4_0"
      },
      "expires_at": new Date("2024-06-04T14:38:31.83753-07:00"),
      "size_vram": 5137025024
    }
  ]

  let entry: ModelEntry | null = null

  $: {
    const model = selectedModel ? allModels.find(m => m.name === selectedModel) : undefined
    if (model) {
      const runModel = runningModels.find(m => m.name === model.name)

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

<div class="h-full flex">
  <div class="h-full">
    <ModelFinder bind:selectedModel {allModels} {runningModels} />
  </div>
  <div class="size-full">
    <Panel {entry} />
  </div>
</div>
