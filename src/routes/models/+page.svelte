<script lang="ts">
  import { ModelDetails, ModelList } from "$lib/components/models"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
    <ModelList />
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane>
    <ModelDetails />
  </ResizablePane>
</ResizablePaneGroup>

