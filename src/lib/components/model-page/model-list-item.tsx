import { TriangleAlertIcon, XIcon } from "lucide-solid";
import { createMemo, Match, Show, Switch } from "solid-js";
import { cn } from "~/lib/utils/class-names";
import { LoaderSpin } from "../loader-spin";
import StatusDot from "../custom-ui/status-dot";
import { Badge } from "../ui/badge";
import { emit } from "@tauri-apps/api/event";
import { toEventString } from "~/lib/utils/strings";
import { toast } from "solid-sonner";
import RelativeTime from "../custom-ui/relative-time";
import ProgressSize from "../custom-ui/progress-size";
import { Progress } from "../ui/progress";
import { activeModels, currentModel, defaultModel, setCurrentModel } from "~/lib/contexts/globals/model-states";
import { clearPullTasks } from "~/lib/contexts/globals/pull-model-tasks";

export interface ModelListItemProps {
  name: string;
  message?: string;
  totalSize?: number;
  modifiedAt?: Date;
  completedSize?: number;
  status?: "inProgress" | "failure" | "canceled";
  index: number;
}

export function ModelListItem(props: ModelListItemProps) {
  const selected = createMemo(() => currentModel() === props.name);
  const isDefault = createMemo(() => defaultModel() === props.name);

  const completed = () => props.completedSize;
  const total = () => props.totalSize;

  const status = () => props.status;

  const name = () => props.name;
  const message = () => props.message;

  return (
    <div
      class={cn(
        "flex flex-col rounded cursor-pointer overflow-hidden",
        selected() ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
      )}
      role="button"
      tabindex={props.index}
      on:click={(ev) => {
        setCurrentModel(props.name);
        ev.stopPropagation();
      }}
    >
      <div class="flex flex-col px-2 py-2 gap-2">
        <div class="flex items-center select-none gap-1">
          <Switch>
            <Match when={status() === "failure"}>
              <TriangleAlertIcon class="size-4" />
            </Match>
            <Match when={status() === "inProgress"}>
              <LoaderSpin class="size-4" />
            </Match>
          </Switch>

          <span class="font-bold">{name()}</span>

          <Show
            when={activeModels()
              .map((item) => item.name)
              .includes(name())}
          >
            <StatusDot status="success" />
          </Show>

          <Show when={isDefault()}>
            <Badge variant={selected() ? "secondary" : "default"} title="Newly created sessions will use this model.">
              Default
            </Badge>
          </Show>

          <div class="grow" />
          <Show when={status()}>
            {(s) => (
              <button
                title={s() === "canceled" ? "Remove" : "Cancel"}
                onClick={() => {
                  if (s() === "canceled" || s() === "failure") {
                    clearPullTasks(name());
                  } else {
                    const promise = emit(`cancel-pull/${toEventString(name())}`);

                    toast.promise(promise, {
                      loading: "Cancel request sent",
                      success: "Pulling task canceled",
                      error: (err) => `Error: ${err}`,
                    });
                  }
                }}
              >
                <XIcon class="size-4" />
              </button>
            )}
          </Show>
        </div>

        <div class="flex items-center text-xs gap-1">
          <Show when={message()}>{(msg) => <span class="truncate">{msg()}</span>}</Show>
          <Show when={props.modifiedAt}>
            {(ma) => (
              <span class="flex gap-1">
                Modified
                <RelativeTime date={ma()} />
              </span>
            )}
          </Show>
          <div class="grow" />
          <ProgressSize completed={completed()} total={total()} />
        </div>
      </div>

      <Show when={completed() === undefined && total() === undefined}>
        <Progress
          minValue={0}
          maxValue={total()}
          value={completed()}
          indeterminate={completed() === undefined || total() === undefined}
          class={cn("h-1 rounded-none bg-transparent", selected() && "invert")}
        />
      </Show>
    </div>
  );
}
