<script lang="ts">
  import { ModelDetails, ModelList } from "$lib/components/models"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
  import { activeModels, currentModel } from "$lib/stores/models"
  import { onMount } from "svelte"

  onMount(() => {
    activeModels.reload()
  })
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
    <ModelList />
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane>
    <ModelDetails
      model={$currentModel}
      runningInfo={$activeModels.find(({ name }) => name === $currentModel)}
      onExpire={() => {
        $activeModels = [...$activeModels.filter(({ name }) => name !== $currentModel)]
      }}
    />
  </ResizablePane>
</ResizablePaneGroup>

