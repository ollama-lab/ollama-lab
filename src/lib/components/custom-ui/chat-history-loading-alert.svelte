<script lang="ts">
  import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
  import { chatHistory } from "$lib/stores/chats"
  import { Loader2Icon } from "lucide-svelte"

</script>

<AlertDialog open={$chatHistory?.loading ?? false}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle class="flex items-center gap-2">
        <Loader2Icon class="animate-spin" />
        Loading chat history...
      </AlertDialogTitle>

      <AlertDialogDescription>
        Please wait for the chat history to be loaded.
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>
