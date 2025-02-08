<script lang="ts">
  import "@fontsource-variable/inter"
  import '../app.css'
  import "$lib/markdown-display.css"
  import { mode, ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"
  import { Toaster } from "$lib/components/ui/sonner"
  import { onMount } from "svelte"
  import { frontendState } from "$lib/stores/app-state"
  import { initialize } from "$lib/utils/init"
  import InitAlert from "$lib/components/init-alert.svelte"
  import darkTheme from "highlight.js/styles/tokyo-night-dark.min.css?raw"
  import lightTheme from "highlight.js/styles/tokyo-night-dark.min.css?raw"

  let { children } = $props()

  let initError = $state<any>()

  onMount(async () => {
    if (!$frontendState.initialized) {
      try {
        await initialize()
      } catch (err) {
        initError = err
        return
      }
    }
  })

  $effect(() => {
    document.querySelector("#hljs-link")?.remove()
    const el = document.createElement("style")
    el.id = "hljs-link"

    if ($mode === "dark") {
      el.innerText = darkTheme
    } else {
      el.innerText = lightTheme
    }

    document.head.append(el)
  })
</script>

<InitAlert {initError} />
<ModeWatcher defaultMode="system" />
<Toaster
  closeButton
  richColors
  class="font-sans"
/>


<div class="flex flex-row w-dvw h-dvh">
  <AppBar />

  <div class="flex-grow">
    {@render children()}
  </div>
</div>
