import { Accessor, createSignal, Match, Switch } from "solid-js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { CopyIcon } from "lucide-solid";
import { LoaderSpin } from "../../loader-spin";
import { copyModel } from "~/lib/commands/models";
import { useModelContext } from "~/lib/contexts/model-list";
import { completeModelName } from "~/lib/utils/model-name";
import { toast } from "solid-sonner";
import { TextField, TextFieldInput } from "../../ui/text-field";

export interface DuplicateModelProps {
  model: Accessor<string>;
}

export function DuplicateModel(props: DuplicateModelProps) {
  const modelContext = useModelContext();

  const [open, setOpen] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);

  const model = props.model;

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button<"button">} size="icon" title="Duplicate">
        <CopyIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate model</DialogTitle>
          <DialogDescription>
            Enter the new model name for the copy.
          </DialogDescription>
        </DialogHeader>

        <Switch>
          <Match when={submitting()}>
            <LoaderSpin text="Proceeding..." />
          </Match>
          <Match when={!submitting()}>
            <form
              class="flex flex-col gap-4"
              onSubmit={async (ev) => {
                ev.preventDefault();
                setSubmitting(true);

                const formData = new FormData(ev.currentTarget);
                const newModelName = formData.get("model")?.toString();
                if (!newModelName) {
                  return;
                }

                try {
                  await copyModel(model(), newModelName);
                  await modelContext?.reload();
                } finally {
                  setSubmitting(false);
                  setOpen(false);
                }

                const toModel = completeModelName(newModelName);
                modelContext?.setCurrent(toModel);
                toast.success(`Model copied to ${toModel}`)
              }}
            > 
              <TextField>
                <TextFieldInput type="text" name="model" placeholder="New model name" required />
              </TextField>

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Proceed
                </Button>
              </DialogFooter>
            </form>
          </Match>
        </Switch>
      </DialogContent>
    </Dialog>
  );
}
