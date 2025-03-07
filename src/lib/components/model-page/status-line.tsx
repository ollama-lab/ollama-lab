import { Accessor, Component, createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { ProgressEvent } from "~/lib/models/events/progress";
import { LoaderSpin } from "../loader-spin";
import StatusDot from "../custom-ui/status-dot";
import { Countdown } from "./countdown";
import { activeModels, reloadActiveModels } from "~/lib/contexts/globals/model-states";

export const StatusLine: Component<{
  model: Accessor<string>;
  downloadInfo: Accessor<ProgressEvent | undefined>;
}> = (props) => {
  const [expiresInSec, setExpiresInSec] = createSignal(0);

  const downloadInfo = () => props.downloadInfo();

  const runningInfo = createMemo(() => {
    const modelName = props.model();

    return activeModels()?.find(({ name }) => modelName === name);
  });

  return (
    <div class="flex gap-2 items-center text-sm">
      <span class="flex items-center select-none">
        <Switch
          fallback={
            <StatusDot status={downloadInfo()?.type === "failure" ? "error" : runningInfo() ? "success" : "disabled"} />
          }
        >
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

          <Show when={!downloadInfo() || downloadInfo()?.type === "success"}>
            {runningInfo() ? "Active" : "Inactive"}
          </Show>
        </span>
      </span>

      <Show when={expiresInSec() >= 0}>
        <Show when={runningInfo()}>
          {(info) => (
            <>
              <hr class="bg-border h-full w-[2pt]" />
              <span class="flex gap-1" title={info().expires_at.toLocaleString()}>
                Session expires in
                <Countdown
                  seconds={expiresInSec}
                  expiresAt={() => info().expires_at}
                  onTick={setExpiresInSec}
                  onExpire={() => {
                    reloadActiveModels();
                  }}
                />
                second{expiresInSec() !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </Show>
      </Show>
    </div>
  );
}
