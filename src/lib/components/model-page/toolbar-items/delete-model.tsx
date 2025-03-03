import { Accessor, createSignal, Match, Show, Switch } from "solid-js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { TrashIcon } from "lucide-solid";
import { Button } from "../../ui/button";
import { LoaderSpin } from "../../loader-spin";
import { deleteModel } from "~/lib/commands/models";
import { useModelContext } from "~/lib/contexts/model-list";
import { toast } from "solid-sonner";

export interface DeleteModelProps {
  model: Accessor<string>;
}

export default function DeleteModel(props: DeleteModelProps) {
  const modelContext = useModelContext();

  const model = props.model;

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
                const deletionPromise = deleteModel(model())
                  .then(() => {
                    setOpen(false);
                    modelContext?.setCurrent(null);
                    modelContext?.reload();
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
