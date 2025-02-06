<script lang="ts">
  import "@fontsource-variable/figtree"
  import "@fontsource-variable/inter"
  import '../app.css'
  import "$lib/markdown-display.css"
  import { ModeWatcher } from "mode-watcher"
  import AppBar from "$lib/components/app-bar.svelte"
  import { Toaster } from "$lib/components/ui/sonner"
  import { onMount } from "svelte"
  import { frontendState } from "$lib/stores/app-state"
  import { CircleXIcon, Loader2Icon } from "lucide-svelte"
  import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog"
  import { initialize } from "$lib/utils/init"

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
</script>

<ModeWatcher defaultMode="system" />
<Toaster
  closeButton
  richColors
  class="font-sans"
/>

<AlertDialog open={!$frontendState.initialized}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle class="flex gap-2 items-center">
        {#if initError}
          <CircleXIcon class="text-red-700 dark:text-red-400" />
          <span class="text-red-700 dark:text-red-400">Initialization failed!</span>
        {:else}
          <Loader2Icon class="animate-spin" />
          Initializing...
        {/if}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {#if initError}
          {initError}
        {:else}
          Getting some important configurations done.
        {/if}
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
