import { Accessor, Component, createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";
import { deleteSession } from "~/lib/commands/sessions";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { Button } from "~/lib/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "~/lib/components/ui/dialog";
import { clearChatHistory } from "~/lib/contexts/globals/chat-history";
import { currentSession } from "~/lib/contexts/globals/current-session";
import { reloadSessions } from "~/lib/contexts/globals/sessions";

export const DeletionDialog: Component<{
  sessionId: number;
  open?: Accessor<boolean>;
  onOpenChange?: (value: boolean) => void;
}> = (props) => {
  const sessionId = () => props.sessionId;
  const onOpenChange = (value: boolean) => props.onOpenChange?.(value);

  const [proceeding, setProceeding] = createSignal(false);

  const afterDeletion = () => {
    onOpenChange(false);

    if (currentSession()?.id === sessionId()) {
      clearChatHistory();
    }

    toast.success("Session successfully deleted");
    reloadSessions();
  };

  return (
    <Dialog open={props.open?.()} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader class="font-bold text-lg text-red-600 dark:text-red-400">Confirm deletion</DialogHeader>
        <div>
          The session and its chat history will be <b>permanently</b> deleted. This operation cannot be undone.
        </div>

        <DialogFooter>
          <Button
            autofocus
            variant="secondary"
            on:click={(ev) => {
              ev.stopPropagation();
              props.onOpenChange?.(false)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={proceeding()}
            on:click={(ev) => {
              ev.stopPropagation();
              setProceeding(true);

              const sessionId = props.sessionId;

              deleteSession(sessionId)
                .then(afterDeletion)
                .catch((err) => toast.error(`Error: ${err}`))
                .finally(() => setProceeding(false));
            }}
          >
            <Show when={proceeding()} fallback={"Confirm"}>
              <LoaderSpin text="Deleting..." />
            </Show>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
