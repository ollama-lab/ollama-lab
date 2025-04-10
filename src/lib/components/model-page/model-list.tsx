import { createMemo, Index, Match, Switch } from "solid-js";
import { Button } from "../ui/button";
import { CircleAlertIcon, RefreshCwIcon } from "lucide-solid";
import { cn } from "~/lib/utils/class-names";
import { PullModel } from "./pull-model";
import { LoaderSpin } from "../loader-spin";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ModelListItem } from "./model-list-item";
import { modelList, reloadModelStates, status } from "~/lib/contexts/globals/model-states";
import { getTaskMap } from "~/lib/contexts/globals/pull-model-tasks";
import { ModelSearchResultProvider } from "~/lib/contexts/model-search-result";
import { setCurrentModelPageModel } from "~/lib/contexts/globals/model-page";
import { toast } from "solid-sonner";
import { HeaderBar } from "../custom-ui/header-bar";

interface DisplayModelListItem {
  name: string;
  status?: "inProgress" | "failure" | "canceled";
  message?: string;
  completedSize?: number;
  totalSize?: number;
  modifiedAt?: Date;
}

export function ModelList() {
  const modelNameList = createMemo(() => modelList()?.map(({ name }) => name));

  const displayModelList = createMemo<DisplayModelListItem[]>(() => {
    const modelNameListRet = modelNameList();

    return [
      ...Object.entries(getTaskMap())
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
      <HeaderBar title="Models">
        <Button
          variant="outline"
          size="icon"
          disabled={status() === "fetching"}
          title={status() === "fetching" ? "Refreshing..." : "Refresh model list"}
          onClick={() => {
            reloadModelStates()
              .then(() => toast.success("Model list refreshed."));
          }}
        >
          <RefreshCwIcon class={cn(status?.() === "fetching" && "animate-spin")} />
        </Button>

        <ModelSearchResultProvider>
          <PullModel />
        </ModelSearchResultProvider>
      </HeaderBar>

      <div class="grow overflow-y-auto" onClick={() => setCurrentModelPageModel(null)}>
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
