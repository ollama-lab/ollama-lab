<script>
  import { onMount } from "svelte";
  import { autoModeWatcher } from "@skeletonlabs/skeleton";
  import "../app.css"
  import '@fontsource-variable/inter'
  
  onMount(() => {
    autoModeWatcher()
  })
</script>

<head>
  <title>Ollama Lab</title>
</head>

<slot />
