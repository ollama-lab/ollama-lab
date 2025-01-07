<script lang="ts">
  import "@fontsource-variable/figtree"
  import "@fontsource-variable/inter"
  import '../app.css'
  import { ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"

  let { children } = $props()
</script>

<ModeWatcher defaultTheme="system" />

<div class="flex flex-row w-dvw h-dvh">
  <AppBar />

  <div class="flex-grow">
    {@render children()}
  </div>
</div>
