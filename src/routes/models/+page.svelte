<script lang="ts">
  import { PlaceholderTitle } from "$lib/components/models"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25}>
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane>
    <div class="flex flex-col place-items-center place-content-center h-full">
      <PlaceholderTitle />
    </div>
  </ResizablePane>
</ResizablePaneGroup>

