import { createMemo, createResource, Match, onMount, Show, Switch } from "solid-js";
import { PlaceholderTitle } from "./placeholder-title";
import { useModelPageCurrentModel } from "~/lib/contexts/model-page/current-model";
import { useModelContext } from "~/lib/contexts/model-list";
import { Badge } from "../ui/badge";
import { usePullModelTasks } from "~/lib/contexts/pull-model-tasks";
import { getModel } from "~/lib/commands/models";
import SetDefault from "./toolbar-items/set-default";
import { DuplicateModel } from "./toolbar-items/duplicate-model";
import DeleteModel from "./toolbar-items/delete-model";
import { StatusLine } from "./status-line";

function PlaceholderPage() {
  return (
    <div class="flex flex-col items-center place-content-center h-full">
      <PlaceholderTitle />
    </div>
  );
}

export function ModelDetails() {
  const modelPageCurrentModelContext = useModelPageCurrentModel();
  const modelContext = useModelContext();
  const pullModelTasksContext = usePullModelTasks();

  const model = modelPageCurrentModelContext?.[0];
  const defaultModel = modelContext?.defaultModel;

  const downloadInfo = createMemo(() => {
    const taskMap = pullModelTasksContext?.taskMap();
    const m = model?.();

    if (taskMap && m) {
      return taskMap[m];
    }

    return undefined;
  });
  
  const [modelInfo, { refetch }] = createResource(model, async (modelName) => {
    const di = downloadInfo();
    if (di && di.type !== "success") {
      return null;
    }

    return await getModel(modelName);
  });

  onMount(() => {
    modelContext?.reloadActiveModels();
  });

  return (
    <Switch fallback={<PlaceholderPage />}>
      <Match when={model?.()}>
        {(m) => (
          <div class="flex flex-col h-full px-4 py-6 gap-4 overflow-y-auto">
            <div class="border border-border px-4 py-3 rounded flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-xl">{m()}</h3>
                <Show when={defaultModel?.() === m()}>
                  <Badge variant="outline">Default</Badge>
                </Show>
                <div class="grow"></div>
                <div class="flex gap-2 items-center">
                  <Show when={!downloadInfo()}>
                    <Show when={defaultModel?.() !== model?.()}>
                      <SetDefault model={m} />
                    </Show>
                    <DuplicateModel model={m} />
                    <DeleteModel model={m} />
                  </Show>
                </div>
              </div>
              <StatusLine downloadInfo={downloadInfo} model={m} />
            </div>
          </div>
        )}
      </Match>
    </Switch>
  );
}
