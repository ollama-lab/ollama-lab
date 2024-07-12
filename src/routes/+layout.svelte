<script>
  import { onMount } from "svelte";
  import { autoModeWatcher, initializeStores, Modal } from "@skeletonlabs/skeleton";
  import "../app.css"
  import '@fontsource-variable/inter'

  initializeStores()
  
  onMount(() => {
    autoModeWatcher()
  })
</script>

<svelte:head>
  <title>Ollama Lab</title>
</svelte:head>

<Modal />

<slot />
