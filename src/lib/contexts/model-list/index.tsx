import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getDefaultModel, listLocalModels, listRunningModels, setDefaultModel } from "~/lib/commands/models";
import { ModelListItem, RunningModel } from "~/lib/models/model-item";

type FetchingStatus = "unfetched" | "fetching" | "error" | "fetched";

interface ModelContextCollection {
  modelList: ModelListItem[];
  defaultModel: string | null;
  currentModel: string | null;
  activeModels: RunningModel[];
  status: FetchingStatus;
  init: () => Promise<void>;
  reload: () => Promise<void>;
  reloadActiveModels: () => Promise<void>;
  reloadDefaultModel: () => Promise<void>;
  setDefault: (newModel: string) => Promise<void>;
  setCurrent: (newModel: string) => void;
}

const ModelContext = createContext<ModelContextCollection>();

export interface ModelContextProviderProps {
  children?: JSX.Element;
}

interface InternalStore {
  modelList: ModelListItem[];
  defaultModel: string | null;
  currentModel: string | null;
  activeModels: RunningModel[];
  status: FetchingStatus;
}

export function ModelContextProvider(props: ModelContextProviderProps) {
  const [store, setStore] = createStore<InternalStore>({
    modelList: [],
    defaultModel: null,
    currentModel: null,
    activeModels: [],
    status: "unfetched",
  });

  const reloadActiveModels = async () => {
    const result = await listRunningModels();
    setStore("activeModels", result);
  };

  const reloadDefaultModel = async () => {
    setStore("defaultModel", await getDefaultModel());
  };

  const reload = async () => {
    setStore("status", "fetching");

    const result = await listLocalModels();
    setStore("modelList", result);
    setStore("status", "fetched");

    await reloadActiveModels();
    await reloadDefaultModel();
  };

  const init = async () => {
    if (store.status === "unfetched") {
      await reload();
    }
  };

  const setDefault = async (newModel: string) => {
    await setDefaultModel(newModel);
    setStore("defaultModel", newModel);
  };

  const setCurrent = (newModel: string) => {
    setStore("currentModel", newModel);
  };

  return (
    <ModelContext.Provider
      value={{
        modelList: store.modelList,
        defaultModel: store.defaultModel,
        currentModel: store.currentModel,
        activeModels: store.activeModels,
        status: store.status,
        init,
        reload,
        reloadActiveModels,
        reloadDefaultModel,
        setDefault,
        setCurrent,
      }}
    >
      {props.children}
    </ModelContext.Provider>
  );
}

export function useModelContext() {
  return useContext(ModelContext);
}
