import { Accessor, Component, createSignal, Match, Show, Switch } from "solid-js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { TrashIcon } from "lucide-solid";
import { Button } from "../../ui/button";
import { LoaderSpin } from "../../loader-spin";
import { deleteModel } from "~/lib/commands/models";
import { toast } from "solid-sonner";
import { reloadModelStates, setCurrentModel } from "~/lib/contexts/globals/model-states";

const DeleteModel: Component<{
  model: Accessor<string>;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button<"button">} title="Delete" size="icon" variant="destructive">
        <TrashIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-red-700 dark:text-red-500">
            <Switch fallback={"Confirm deletion"}>
              <Match when={submitting()}>
                <LoaderSpin text="Deleting model..." />
              </Match>
            </Switch>
          </DialogTitle>
        </DialogHeader>

        <Show when={!submitting()}>
          <div>
            The model will be <b>permanently</b> deleted.
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                setSubmitting(true);
                const deletionPromise = deleteModel(props.model())
                  .then(async () => {
                    setOpen(false);
                    setCurrentModel(null);
                    await reloadModelStates();
                  })
                  .finally(() => setSubmitting(false));

                toast.promise(deletionPromise, {
                  loading: "Deleting model...",
                  success: "Model successfully deleted",
                  error: (err) => {
                    return `Deletion failed: ${err}`;
                  },
                });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </Show>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModel;
