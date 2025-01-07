<script lang="ts">
  import { SessionList } from "$lib/components/sessions"
  import { ResizablePane, ResizablePaneGroup } from "$lib/components/ui/resizable"
  import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte"
</script>

<ResizablePaneGroup direction="horizontal">
  <ResizablePane defaultSize={25} collapsible>
    <SessionList />
  </ResizablePane>
  <ResizableHandle />
  <ResizablePane />
</ResizablePaneGroup>

