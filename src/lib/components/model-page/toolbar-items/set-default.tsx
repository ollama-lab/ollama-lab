import { Accessor } from "solid-js";
import { Button } from "../../ui/button";
import { toast } from "solid-sonner";
import { defaultModel, setDefaultModel } from "~/lib/contexts/globals/model-states";

export interface SetDefaultProps {
  model: Accessor<string>;
}

export default function SetDefault(props: SetDefaultProps) {
  return (
    <Button
      onClick={() => {
        // Optimistic update
        const prev = defaultModel();
        const m = props.model();

        setDefaultModel(m);
        setDefaultModel(m).catch((err) => {
          if (prev) {
            setDefaultModel(prev);
          }

          toast.error(err);
        });
      }}
    >
      Set default
    </Button>
  );
}
