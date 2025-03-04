import { createMemo, createResource, createSignal, Match, onMount, Show, Suspense, Switch } from "solid-js";
import { PlaceholderTitle } from "./placeholder-title";
import { Badge } from "../ui/badge";
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
import { SystemPromptSection } from "./sections/system-prompt";
import { currentModelPageModel } from "~/lib/contexts/globals/model-page";
import { getTaskMap } from "~/lib/contexts/globals/pull-model-tasks";
import { defaultModel, reloadActiveModels } from "~/lib/contexts/globals/model-states";
import { ProgressEvent } from "~/lib/models/events/progress";
import { ModelInfo } from "./sections/model-info";

function PlaceholderPage() {
  return (
    <div class="flex flex-col items-center place-content-center h-full">
      <PlaceholderTitle />
    </div>
  );
}

interface FetchingProps {
  modelName: string | null;
  downloadInfo?: ProgressEvent;
}

async function fetcher({ modelName, downloadInfo }: FetchingProps) {
  if (!modelName || (downloadInfo && downloadInfo.type !== "success")) {
    return null;
  }

  return await getModel(modelName);
}

export function ModelDetails() {
  const model = () => currentModelPageModel();

  const downloadInfo = createMemo(() => {
    const taskMap = getTaskMap();
    const m = model?.();

    if (taskMap && m) {
      return taskMap[m];
    }

    return undefined;
  });

  const [modelInfo] = createResource(() => ({ modelName: model(), downloadInfo: downloadInfo() }), fetcher);

  onMount(() => {
    reloadActiveModels();
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
                <Show when={defaultModel() === m()}>
                  <Badge variant="outline">Default</Badge>
                </Show>
                <div class="grow" />
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
