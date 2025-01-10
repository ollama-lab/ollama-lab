<script lang="ts">
  import { listRunningModels } from "$lib/commands/models"
  import { ModelDetails, ModelList } from "$lib/components/models"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
  import type { RunningModel } from "$lib/models/model-item"
  import { onMount } from "svelte"

  let currentModel = $state<string | undefined>()
  let activeModels = $state<RunningModel[]>([])

  onMount(() => {
    // TODO: Realtime update

    listRunningModels()
      .then(result => activeModels = result)
  })
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
    <ModelList bind:currentModel bind:activeModels />
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane>
    <ModelDetails
      model={currentModel}
      runningInfo={activeModels.find(({ name }) => name === currentModel)}
    />
  </ResizablePane>
</ResizablePaneGroup>

