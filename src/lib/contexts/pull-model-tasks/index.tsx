import { Channel } from "@tauri-apps/api/core";
import { Accessor, createContext, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ProgressEvent } from "~/lib/models/events/progress";
import { useModelContext } from "../model-list";

interface TaskMap {
  [id: string]: ProgressEvent;
}

interface TaskMapContextCollection {
  taskMap: Accessor<TaskMap>;
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
  const [taskMapStore, setTaskMap] = createStore<TaskMap>({});

  const modelContext = useModelContext();

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
          clear(model);
          modelContext?.reload();
          break;

        case "canceled":
          clear(model);

          const m = modelContext?.currentModel();
          if (m === model) {
            modelContext?.setCurrent(null);
          }
          break;

        default:
          break;
      }
    };

    return chan;
  };

  const taskMap = () => taskMapStore;

  return (
    <PullModelTasksContext.Provider value={{ taskMap, clear, add, error, channel }}>
      {props.children}
    </PullModelTasksContext.Provider>
  );
}

export function usePullModelTasks() {
  return useContext(PullModelTasksContext);
}
