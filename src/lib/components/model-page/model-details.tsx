import { createMemo, createResource, createSignal, Match, onMount, Show, Suspense, Switch } from "solid-js";
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
import { LoaderSpin } from "../loader-spin";
import { Progress } from "../ui/progress";
import ProgressSize from "../custom-ui/progress-size";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeBlock } from "../custom-ui/code-block";
import { Details } from "./sections/details";
import { ModelInfo } from "./sections/model-info";
import { SystemPromptSection } from "./sections/system-prompt";

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

  const [modelInfo] = createResource(model, async (modelName) => {
    const di = downloadInfo();
    if (di && di.type !== "success") {
      return null;
    }

    return await getModel(modelName);
  });

  onMount(() => {
    modelContext?.reloadActiveModels();
  });

  const [tabValue, setTabValue] = createSignal<string>("details");

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

            <div>
              <Show when={modelInfo.loading}>
                <LoaderSpin text="Loading..." />
              </Show>
              <Show when={downloadInfo()}>
                {(info) => {
                  const infoObj = info();
                  return (
                    infoObj.type === "inProgress" && (
                      <div class="flex text-sm gap-2 md:gap-3.5 items-center">
                        <Progress
                          minValue={0}
                          maxValue={infoObj.total ?? undefined}
                          value={infoObj.completed ?? undefined}
                          indeterminate={infoObj.completed === null}
                        />
                        <ProgressSize completed={infoObj.completed ?? undefined} total={infoObj.total ?? undefined} />
                      </div>
                    )
                  );
                }}
              </Show>

              <Suspense>
                <Tabs value={tabValue()} onChange={setTabValue}>
                  <TabsList class="sticky -top-6 z-20">
                    <Show when={modelInfo()}>
                      {(info) => (
                        <>
                          <Show when={info().details}>
                            <TabsTrigger value="details">Details</TabsTrigger>
                          </Show>
                          <TabsTrigger value="modelfile">Modelfile</TabsTrigger>
                          <Show when={info().model_info}>
                            <TabsTrigger value="info">Model Info</TabsTrigger>
                          </Show>
                          <Show when={info().parameters}>
                            <TabsTrigger value="parameters">Parameters</TabsTrigger>
                          </Show>
                          <TabsTrigger value="template">Template</TabsTrigger>
                        </>
                      )}
                    </Show>
                    <TabsTrigger value="system-prompt">System Prompt</TabsTrigger>
                  </TabsList>

                  <div>
                    <Show when={modelInfo()}>
                      {(info) => (
                        <>
                          <Show when={info().modelfile}>
                            {(content) => (
                              <TabsContent value="modelfile">
                                <CodeBlock code={content()} />
                              </TabsContent>
                            )}
                          </Show>
                          <Show when={info().details}>
                            {(d) => (
                              <TabsContent value="details">
                                <Details value={d()} />
                              </TabsContent>
                            )}
                          </Show>
                          <Show when={info().model_info}>
                            {(mi) => (
                              <TabsContent value="info">
                                <ModelInfo value={mi()} />
                              </TabsContent>
                            )}
                          </Show>
                          <Show when={info().parameters}>
                            {(p) => (
                              <TabsContent value="parameters">
                                <CodeBlock code={p()} />
                              </TabsContent>
                            )}
                          </Show>
                          <Show when={info().template}>
                            {(t) => (
                              <TabsContent value="template">
                                <CodeBlock code={t()} />
                              </TabsContent>
                            )}
                          </Show>
                        </>
                      )}
                    </Show>

                    <TabsContent value="system-prompt">
                      <SystemPromptSection model={m()} />
                    </TabsContent>
                  </div>
                </Tabs>
              </Suspense>
            </div>
          </div>
        )}
      </Match>
    </Switch>
  );
}
