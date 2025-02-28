<script lang="ts">
  import { frontendState } from "$lib/stores/app-state"
  import { CircleXIcon, Loader2Icon } from "lucide-svelte"
  import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

  let { initError }: {
    initError: any
  } = $props()
</script>

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
