import { Accessor, Component } from "solid-js";
import { Button } from "../../ui/button";
import { toast } from "solid-sonner";
import { defaultModel, setDefaultModel } from "~/lib/contexts/globals/model-states";

const SetDefault: Component<{
  model: Accessor<string>;
}> = (props) => {
  return (
    <Button
      onClick={() => {
        // Optimistic update
        const prev = defaultModel();
        const m = props.model();

        setDefaultModel(m).catch((err) => {
          if (prev) {
            setDefaultModel(prev);
          }

          toast.error(err);
        });
      }}
    >
      Set as default
    </Button>
  );
}

export default SetDefault;
