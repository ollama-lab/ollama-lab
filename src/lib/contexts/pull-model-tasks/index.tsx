import { Channel } from "@tauri-apps/api/core";
import { createContext, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ProgressEvent } from "~/lib/models/events/progress";

interface TaskMap {
  [id: string]: ProgressEvent;
}

interface TaskMapContextCollection {
  taskMap: TaskMap;
  clear: (id?: string) => void;
  add: (id: string, message: string) => void;
  error: (id: string, message: string) => void;
  channel: (model: string) => Channel<ProgressEvent>;
}

const PullModelTasksContext = createContext<TaskMapContextCollection>();

export interface PullModelTasksProviderProps {
  children?: JSX.Element;
}

export function PullModelTasksProvider(props: PullModelTasksProviderProps) {
  const [taskMap, setTaskMap] = createStore<TaskMap>({});

  const clear = (id?: string) => {
    if (id === undefined) {
      setTaskMap({});
      return;
    }

    setTaskMap(produce((cur) => delete cur[id]));
  };

  const add = (id: string, message: string) => {
    setTaskMap(
      produce((cur) => {
        if (!cur[id]) {
          cur[id] = {
            id,
            type: "inProgress",
            message,
          };
        }
      }),
    );
  };

  const error = (id: string, message: string) => {
    setTaskMap(id, {
      id,
      type: "failure",
      message,
    });
  };

  const channel = (model: string) => {
    const chan = new Channel<ProgressEvent>();
    chan.onmessage = (msgEv) => {
      setTaskMap(model, msgEv);

      switch (msgEv.type) {
        case "success":
          // TODO: reload model list
          clear(model);
          break;

        case "canceled":
          // TODO: reset current model
          clear(model);
          break;

        default:
          break;
      }
    };

    return chan;
  };

  return (
    <PullModelTasksContext.Provider
      value={{ taskMap, clear, add, error, channel }}
    >
      {props.children}
    </PullModelTasksContext.Provider>
  );
}

export function usePullModelTasks() {
  return useContext(PullModelTasksContext);
}
