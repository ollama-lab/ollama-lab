import { Accessor, createEffect, createSignal, Match, Switch } from "solid-js";
import { toast } from "solid-sonner";
import { deleteSession } from "~/lib/commands/sessions";
import { LoaderSpin } from "~/lib/components/loader-spin";
import { Button } from "~/lib/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "~/lib/components/ui/dialog";
import { clearChatHistory, getChatHistory } from "~/lib/contexts/globals/chat-history";
import { reloadSessions } from "~/lib/contexts/globals/sessions";

export interface DeletionDialogProps {
  sessionId: number;
  open?: Accessor<boolean>;
  onOpenChange?: (value: boolean) => void;
}

export function DeletionDialog(props: DeletionDialogProps) {
  const sessionId = () => props.sessionId;
  const onOpenChange = (value: boolean) => props.onOpenChange?.(value);

  const [proceeding, setProceeding] = createSignal(false);

  const currentSession = () => getChatHistory()?.session;

  const afterDeletion = () => {
    onOpenChange(false);

    if (currentSession() === sessionId()) {
      clearChatHistory();
    }

    toast.success("Session successfully deleted");
    reloadSessions();
  };

  return (
    <Dialog open={props.open?.()} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader class="font-bold text-lg text-red-600 dark:text-red-400">
          Confirm deletion
        </DialogHeader>
        <div>
          The session and its chat history will be <b>permanently</b> deleted. This operation cannot be undone.
        </div>

        <DialogFooter>
          <Button autofocus variant="secondary" on:click={() => props.onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={proceeding()}
            on:click={() => {
              setProceeding(true);

              const sessionId = props.sessionId;

              deleteSession(sessionId)
                .then(afterDeletion)
                .catch((err) => toast.error(`Error: ${err}`))
                .finally(() => setProceeding(false));
            }}
          >
            <Switch fallback={"Confirm"}>
              <Match when={proceeding()}>
                <LoaderSpin text="Deleting..." />
              </Match>
            </Switch>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
