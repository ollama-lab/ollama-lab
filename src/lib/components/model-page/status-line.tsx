import { Accessor, createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { useModelContext } from "~/lib/contexts/model-list";
import { ProgressEvent } from "~/lib/models/events/progress";
import { LoaderSpin } from "../loader-spin";
import StatusDot from "../custom-ui/status-dot";

export interface StatusLineProps {
  model: Accessor<string>;
  downloadInfo: Accessor<ProgressEvent | undefined>;
}

export function StatusLine(props: StatusLineProps) {
  const modelContext = useModelContext();

  const downloadInfo = props.downloadInfo;

  const [expiresInSec, setExpiresInSec] = createSignal(0);

  const runningInfo = createMemo(() => {
    const modelName = props.model();

    return modelContext?.activeModels()?.find(({ name }) => modelName === name);
  });

  return (
    <div class="flex gap-2 items-center text-sm">
      <span class="flex items-center select-none">
        <Switch fallback={(
          <StatusDot status={downloadInfo()?.type === "failure" ? "error" : runningInfo() ? "success" : "disabled"} />
        )} >
          <Match when={downloadInfo()?.type === "inProgress"}>
            <LoaderSpin class="size-4 mr-2" />
          </Match>
        </Switch>
        <span>
          <Show when={downloadInfo()}>
            {(info) => {
              const infoObj = info();
              switch (infoObj.type) {
                case "inProgress":
                  return infoObj.message;

                case "failure":
                  return `Error: ${infoObj.message}`;

                default:
                  return "";
              }
            }}
          </Show>

          <Show when={downloadInfo()?.type === "success"}>
            {runningInfo() ? "Active" : "Inactive"}
          </Show>
        </span>
      </span>

      <Show when={runningInfo() && expiresInSec() >= 0}>
        <hr class="bg-border h-full w-[2pt]" />
      </Show>
    </div>
  );
}
