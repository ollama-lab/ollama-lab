import { createEffect, createMemo, Index, Match, Switch } from "solid-js";
import { useModelContext } from "~/lib/contexts/model-list";
import { usePullModelTasks } from "~/lib/contexts/pull-model-tasks";
import { Button } from "../ui/button";
import { toast } from "solid-sonner";
import { CircleAlertIcon, RefreshCwIcon } from "lucide-solid";
import { cn } from "~/lib/utils/class-names";
import { PullModel } from "./pull-model";
import { useModelPageCurrentModel } from "~/lib/contexts/model-page/current-model";
import { LoaderSpin } from "../loader-spin";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ModelListItem } from "./model-list-item";

interface DisplayModelListItem {
  name: string;
  status?: "inProgress" | "failure" | "canceled";
  message?: string;
  completedSize?: number;
  totalSize?: number;
  modifiedAt?: Date;
}

export function ModelList() {
  const modelContext = useModelContext();
  const pullModelTasksContext = usePullModelTasks();
  const modelPageCurrentModel = useModelPageCurrentModel();

  const status = modelContext?.status;

  const setCurrentModel = modelPageCurrentModel?.[1];

  const modelList = modelContext?.modelList;
  const modelNameList = createMemo(() => modelList?.()?.map(({ name }) => name));

  createEffect(() => {
    modelContext?.init();
  });

  const displayModelList = createMemo<DisplayModelListItem[]>(() => {
    if (!pullModelTasksContext) {
      return [];
    }

    const modelNameListRet = modelNameList();

    return [
      ...Object.entries(pullModelTasksContext.taskMap())
        .filter(([name]) => !modelNameListRet?.includes(name))
        .map(([name, item]) => {
          switch (item.type) {
            case "inProgress":
              return {
                name,
                status: "inProgress",
                message: item.message,
                completedSize: item.completed === null ? undefined : item.completed,
                totalSize: item.total === null ? undefined : item.total,
              } satisfies DisplayModelListItem;
            case "failure":
              return {
                name,
                message: item.message ?? undefined,
                status: "failure",
              } satisfies DisplayModelListItem;
            case "success":
              return {
                name,
              } satisfies DisplayModelListItem;
            case "canceled":
              return {
                name,
                status: "canceled",
                message: item.message ?? undefined,
              } satisfies DisplayModelListItem;
          }
        }),
      ...(modelList?.().map(
        (item) =>
          ({
            name: item.name,
            totalSize: item.size,
            modifiedAt: item.modified_at,
          }) satisfies DisplayModelListItem,
      ) ?? []),
    ];
  });

  return (
    <div class="w-full h-full flex flex-col">
      <div class="sticky py-4 px-3 shrink-0 flex place-items-center backdrop-blur-lg bg-background/50">
        <h2 class="text-lg font-bold select-none flex-grow">Models</h2>
        <div class="shrink-0">
          <Button
            variant="outline"
            size="icon"
            disabled={status?.() === "fetching"}
            title={status?.() === "fetching" ? "Refreshing..." : "Refresh model list"}
            onClick={() => {
              const reloadPromise = modelContext?.reload();
              if (reloadPromise) {
                toast.promise(reloadPromise, {
                  loading: "Refreshing model list...",
                  success: "Model list refreshed.",
                  error: (err) => {
                    return `Failed to refresh model list: ${err}`;
                  },
                });
              }
            }}
          >
            <RefreshCwIcon class={cn(status?.() === "fetching" && "animate-spin")} />
          </Button>

          <PullModel />
        </div>
      </div>

      <div class="grow overflow-y-auto" onClick={() => setCurrentModel?.(null)}>
        <div class="flex flex-col gap-2 px-2">
          <Switch>
            <Match when={status?.() === "fetching"}>
              <LoaderSpin text="Loading" />
            </Match>
            <Match when={status?.() === "error"}>
              <Alert class="bg-destructive text-destructive-foreground border-destructive">
                <CircleAlertIcon class="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to fetch the model list.</AlertDescription>
              </Alert>
            </Match>
          </Switch>

          <Index each={displayModelList()}>{(item, index) => <ModelListItem index={index} {...item()} />}</Index>
        </div>
      </div>
    </div>
  );
}
