import { createStore } from "solid-js/store";
import { ModelListItem, RunningModel } from "~/lib/models/model-item";
import { getDefaultModel, listLocalModels, listRunningModels } from "~/lib/commands/models";
import { createEffect } from "solid-js";
import { toast } from "solid-sonner";
import { setDefaultModel as setDefaultModelCommand } from "~/lib/commands/models";

export type FetchingStatus = "unfetched" | "fetching" | "error" | "fetched";

interface ModelStates {
  modelList: ModelListItem[];
  defaultModel: string | null;
  activeModels: RunningModel[];
  status: FetchingStatus;
}

const [modelStatesStore, setStore] = createStore<ModelStates>({
  modelList: [],
  defaultModel: null,
  activeModels: [],
  status: "unfetched",
});

export async function reloadActiveModels() {
  const result = await listRunningModels();
  setStore("activeModels", result);
}

export async function reloadDefaultModel() {
  setStore("defaultModel", await getDefaultModel());
}

export async function reloadModelStates() {
  setStore("status", "fetching");

  try {
    const result = await listLocalModels();
    setStore("modelList", result);
    setStore("status", "fetched");

    await reloadActiveModels();
    await reloadDefaultModel();
  } catch (err) {
    setStore("status", "error");
    toast.error(String(err));
    return;
  }
}

export async function initModelStates() {
  if (modelStatesStore.status === "unfetched") {
    await reloadModelStates();
  }
}

createEffect(() => {
  initModelStates();
});

export async function setDefaultModel(newModel: string) {
  await setDefaultModelCommand(newModel);
  setStore("defaultModel", newModel);
}

export function modelList() {
  return modelStatesStore.modelList;
}

export function defaultModel() {
  return modelStatesStore.defaultModel;
}

export function activeModels() {
  return modelStatesStore.activeModels;
}

export function status() {
  return modelStatesStore.status;
}
