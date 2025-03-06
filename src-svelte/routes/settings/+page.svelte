<script lang="ts">
  import { settings } from "$lib/stores/settings"
  import Sidebar from "$lib/settings/components/sidebar.svelte"
  import { en } from "$lib/settings/names/en"
  import ResizablePaneGroup from "$lib/components/ui/resizable/resizable-pane-group.svelte"
  import { ResizableHandle, ResizablePane } from "$lib/components/ui/resizable"
  import SettingsDetails from "$lib/settings/components/settings-details.svelte"

  const t = en 

  let activeKey = $state<string>("")
</script>

<ResizablePaneGroup direction="horizontal">
  {#if $settings}
    <ResizablePane defaultSize={0} collapsible>
      <Sidebar
        value={Object.keys($settings).reduce((acc, cur) => ({ ...acc, [cur]: t[cur] ?? cur }), {})}
        bind:activeKey
      />
    </ResizablePane>
    <ResizableHandle />
    <ResizablePane>
      <SettingsDetails />
    </ResizablePane>
  {/if}
</ResizablePaneGroup>
