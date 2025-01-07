<script lang="ts">
  import { ModeWatcher } from "mode-watcher"
  import '../app.css'
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
