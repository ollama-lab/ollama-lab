<script>
  import { onMount } from "svelte";
  import { autoModeWatcher, initializeStores, Modal, storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
  import "../app.css"
  import '@fontsource-variable/inter'

  initializeStores()
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
  
  onMount(() => {
    autoModeWatcher()
  })
</script>

<svelte:head>
  <title>Ollama Lab</title>
</svelte:head>

<Modal />

<slot />
