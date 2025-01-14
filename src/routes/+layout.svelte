<script lang="ts">
  import "@fontsource-variable/figtree"
  import "@fontsource-variable/inter"
  import '../app.css'
  import "$lib/markdown-display.css"
  import { ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"
  import { Toaster } from "$lib/components/ui/sonner"

  let { children } = $props()
</script>

<ModeWatcher defaultTheme="system" />
<Toaster
  closeButton
/>

<div class="flex flex-row w-dvw h-dvh">
  <AppBar />

  <div class="flex-grow">
    {@render children()}
  </div>
</div>
