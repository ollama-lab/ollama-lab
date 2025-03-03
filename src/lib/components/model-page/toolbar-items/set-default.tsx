import { Accessor } from "solid-js";
import { Button } from "../../ui/button";
import { useModelContext } from "~/lib/contexts/model-list";
import { setDefaultModel } from "~/lib/commands/models";
import { toast } from "solid-sonner";

export interface SetDefaultProps {
  model: Accessor<string>;
}

export default function SetDefault(props: SetDefaultProps) {
  const modelContext = useModelContext();

  const model = props.model;
  const defaultModel = modelContext?.defaultModel;

  return (
    <Button
      onClick={() => {
        // Optimistic update
        const prev = defaultModel?.();
        const m = model();

        modelContext?.setDefault(m);
        setDefaultModel(m).catch((err) => {
          if (prev) {
            modelContext?.setDefault(prev);
          }

          toast.error(err);
        });
      }}
    >
      Set default
    </Button>
  );
}
