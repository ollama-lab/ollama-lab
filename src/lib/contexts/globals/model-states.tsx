import { createStore } from "solid-js/store";
import { ModelListItem, RunningModel } from "../models/model-item";
import { getDefaultModel, listLocalModels, listRunningModels, setDefaultModel } from "../commands/models";

export type FetchingStatus = "unfetched" | "fetching" | "error" | "fetched";

interface ModelStates {
  modelList: ModelListItem[];
  defaultModel: string | null;
  currentModel: string | null;
  activeModels: RunningModel[];
  status: FetchingStatus;
}

const [modelStatesStore, setStore] = createStore<ModelStates>({
  modelList: [],
  defaultModel: null,
  currentModel: null,
  activeModels: [],
  status: "unfetched",
});

export async function reloadActiveModels() {
  const result = await listRunningModels();
  setStore("activeModels", result);
};

export async function reloadDefaultModel() {
  setStore("defaultModel", await getDefaultModel());
};

export async function reloadModelStates() {
  setStore("status", "fetching");

  const result = await listLocalModels();
  setStore("modelList", result);
  setStore("status", "fetched");

  await reloadActiveModels();
  await reloadDefaultModel();
}

export async function init() {
  if (modelStatesStore.status === "unfetched") {
    await reloadModelStates();
  }
}

export async function setDefaultModel(newModel: string) {
  await setDefaultModel(newModel);
  setStore("defaultModel", newModel);
}

export function setCurrentModel(newModel: string | null) {
  setStore("currentModel", newModel);
};

export function modelList() {
  return modelStatesStore.modelList;
}

export function defaultModel() {
  return modelStatesStore.defaultModel;
}

export function currentModel() {
  return modelStatesStore.currentModel;
}

export function activeModels() {
  return modelStatesStore.activeModels;
}

export function status() {
  return modelStatesStore.status;
}
