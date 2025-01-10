<script lang="ts">
  import { ModelDetails, ModelList } from "$lib/components/models"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"

  let currentModel: string | undefined = undefined
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
    <ModelList bind:currentModel />
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane>
    <ModelDetails model={currentModel} />
  </ResizablePane>
</ResizablePaneGroup>

