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

<head>
  <title>Ollama Lab</title>
</head>

<Modal />

<slot />
