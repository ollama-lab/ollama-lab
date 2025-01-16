<script lang="ts">
  import "@fontsource-variable/figtree"
  import "@fontsource-variable/inter"
  import '../app.css'
  import "$lib/markdown-display.css"
  import { ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"
  import { Toaster } from "$lib/components/ui/sonner"
  import { onMount } from "svelte"
  import { initialize } from "$lib/commands/init"
  import { frontendState } from "$lib/stores/app-state"
  import { Loader2Icon } from "lucide-svelte"
  import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog"

  let { children } = $props()

  onMount(() => {
    if (!$frontendState.initialized) {
      initialize().then(() => {
        $frontendState.initialized = true
      })
    }
  })
</script>

<ModeWatcher defaultTheme="system" />
<Toaster
  closeButton
  richColors
/>

<AlertDialog open={!$frontendState.initialized}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle class="flex gap-2 items-center">
        <Loader2Icon class="animate-spin" />
        Initializing...
      </AlertDialogTitle>
      <AlertDialogDescription>
        Getting some important configurations done.
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>

<div class="flex flex-row w-dvw h-dvh">
  <AppBar />

  <div class="flex-grow">
    {@render children()}
  </div>
</div>
