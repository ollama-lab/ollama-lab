import { Accessor, Match, Switch } from "solid-js";
import { RunningModel } from "~/lib/models/model-item";
import { PlaceholderTitle } from "./placeholder-title";
import { useModelPageCurrentModel } from "~/lib/contexts/model-page/current-model";

function PlaceholderPage() {
  return (
    <div class="flex flex-col items-center place-content-center h-full">
      <PlaceholderTitle />
    </div>
  )
}

export function ModelDetails() {
  const modelPageCurrentModelContext = useModelPageCurrentModel();
  const model = modelPageCurrentModelContext?.[0];

  return (
    <Switch fallback={<PlaceholderPage />}>
      <Match when={model?.()}>
        {(m) => (
          <div class="flex flex-col h-full px-4 py-6 gap-4 overflow-y-auto">
          </div>
        )}
      </Match>
    </Switch>
  );
}
