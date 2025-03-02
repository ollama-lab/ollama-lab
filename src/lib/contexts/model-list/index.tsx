import { createContext, createMemo, JSX, type Accessor } from "solid-js";
import { createStore } from "solid-js/store";
import { toast } from "solid-sonner";
import {
  getDefaultModel,
  listLocalModels,
  listRunningModels,
  setDefaultModel,
} from "~/lib/commands/models";
import { ModelListItem, RunningModel } from "~/lib/models/model-item";

interface ModelListContextCollection {
  modelList: ModelListItem[];
  defaultModel: string | null;
  currentModel: string | null;
  activeModels: RunningModel[];
  selectedSessionModel: Accessor<string | null>;
  init: () => Promise<void>;
  reload: () => Promise<void>;
  reloadActiveModels: () => Promise<void>;
  reloadDefaultModel: () => Promise<void>;
  setDefault: (newModel: string) => Promise<void>;
  setSessionModel: (value: string) => void;
}

const ModelListContext = createContext<ModelListContextCollection>({
  // Placeholder
  modelList: [],
  defaultModel: null,
  currentModel: null,
  activeModels: [],
  selectedSessionModel: () => null,
  init: async () => {},
  reload: async () => {},
  reloadActiveModels: async () => {},
  reloadDefaultModel: async () => {},
  setDefault: async () => {},
  setSessionModel: async () => {},
});

type FetchingStatus = "unfetched" | "fetching" | "error" | "fetched";

export interface ModelListProviderProps {
  children?: JSX.Element;
}

interface InternalStore {
  modelList: ModelListItem[];
  defaultModel: string | null;
  currentModel: string | null;
  candidateSessionModel: string | null;
  activeModels: RunningModel[];
  status: FetchingStatus;
}

export function ModelListProvider(props: ModelListProviderProps) {
  const [store, setStore] = createStore<InternalStore>({
    modelList: [],
    defaultModel: null,
    currentModel: null,
    candidateSessionModel: null,
    activeModels: [],
    status: "unfetched",
  });

  const selectedSessionModel = createMemo(() => {});

  const reloadActiveModels = async () => {
    const result = await listRunningModels();
    setStore("activeModels", result);
  };

  const reloadDefaultModel = async () => {
    setStore("defaultModel", await getDefaultModel());
  };

  const reload = async () => {
    setStore("status", "fetching");

    await listLocalModels()
      .then((result) => {
        setStore("modelList", result);
        setStore("status", "fetched");
      })
      .catch((err) => {
        toast.error(err);
        setStore("status", "error");
      });

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

  return (
    <ModelListContext.Provider
      value={{
        modelList: store.modelList,
        defaultModel: store.defaultModel,
        currentModel: store.currentModel,
        activeModels: store.activeModels,
        init,
        reload,
        reloadActiveModels,
        reloadDefaultModel,
        setDefault,
      }}
    >
      {props.children}
    </ModelListContext.Provider>
  );
}
