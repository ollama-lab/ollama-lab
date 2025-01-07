<script lang="ts">
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane />
</ResizablePaneGroup>

