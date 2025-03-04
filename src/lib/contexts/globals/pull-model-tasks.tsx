import { createStore, produce } from "solid-js/store";
import { Channel } from "@tauri-apps/api/core";
import { currentModel, reloadModelStates, setCurrentModel } from "./model-states";
import { ProgressEvent } from "~/lib/models/events/progress";

export type TaskMap = Record<string, ProgressEvent>;

const [taskMapStore, setTaskMap] = createStore<TaskMap>({});

export function getTaskMap() {
  return taskMapStore;
}

export function clearPullTasks(id?: string) {
  if (id === undefined) {
    setTaskMap({});
    return;
  }

  setTaskMap(produce((cur) => delete cur[id]));
}

export function addPullTask(id: string, message: string) {
  setTaskMap(id, {
    id,
    type: "inProgress",
    message,
  });
}

export function errorPullTask(id: string, message: string) {
  setTaskMap(id, {
    id,
    type: "failure",
    message,
  });
}

// pulltask-chan :3
export function pullTaskChan(model: string) {
  const chan = new Channel<ProgressEvent>();
  chan.onmessage = (ev) => {
    setTaskMap(model, ev);

    switch (ev.type) {
      case "success":
        clearPullTasks(model);
        reloadModelStates();
        break;

      case "canceled":
        clearPullTasks(model);

        {
          const m = currentModel();
          if (m === model) {
            setCurrentModel(null);
          }
        }
        break;

      default:
        break;
    }

    return chan;
  };
}

export { setTaskMap };
