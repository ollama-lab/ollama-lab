<script lang="ts">
  import "@fontsource-variable/figtree"
  import "@fontsource-variable/inter"
  import "@fontsource-variable/fira-code"
  import '../app.css'
  import "$lib/markdown-display.css"
  import { mode, ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"
  import { Toaster } from "$lib/components/ui/sonner"
  import { onMount } from "svelte"
  import { frontendState } from "$lib/stores/app-state"
  import { initialize } from "$lib/utils/init"
  import InitAlert from "$lib/components/init-alert.svelte"

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
    const el = document.createElement("link")
    el.id = "hljs-link"
    el.rel = "stylesheet"

    if ($mode === "dark") {
      el.href = "node_modules/highlight.js/styles/tokyo-night-dark.min.css"
    } else {
      el.href = "node_modules/highlight.js/styles/atom-one-light.min.css"
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
