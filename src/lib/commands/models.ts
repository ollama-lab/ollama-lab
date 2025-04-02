import type { ModelDetails, ModelInfo, ModelListItem, RunningModel } from "~/lib/schemas/model-item";
import { Channel, invoke } from "@tauri-apps/api/core";
import { ProgressEvent } from "../schemas/events/progress";

interface RawModelListItem {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

interface ModelListResponse {
  models: RawModelListItem[];
}

export async function listLocalModels(): Promise<ModelListItem[]> {
  return invoke<ModelListResponse>("list_local_models").then((result) =>
    result.models.map(
      ({ name, modified_at, size }) =>
        ({
          name,
          modified_at: new Date(modified_at),
          size,
        }) satisfies ModelListItem,
    ),
  );
}

interface RawRunningModel {
  name: string;
  modified_at: string;
  size: number;
  details: ModelDetails;
  expires_at: string;
  size_vram: number;
}

interface RunningModelResponse {
  models: RawRunningModel[];
}

export async function listRunningModels(): Promise<RunningModel[]> {
  return invoke<RunningModelResponse>("list_running_models").then((result) =>
    result.models.map(
      ({ name, size_vram, expires_at }) =>
        ({
          name,
          size_vram,
          expires_at: new Date(expires_at),
        }) satisfies RunningModel,
    ),
  );
}

export async function getModel(name: string): Promise<ModelInfo> {
  return invoke<ModelInfo>("get_model", { name });
}

export async function getDefaultModel(): Promise<string | null> {
  return await invoke<string | null>("get_default_model");
}

export async function setDefaultModel(newModel: string): Promise<void> {
  await invoke<void>("set_default_model", { newModel });
}

export async function copyModel(source: string, destination: string): Promise<void> {
  await invoke<void>("copy_model", { source, destination });
}

export async function deleteModel(model: string): Promise<void> {
  await invoke<void>("delete_model", { model });
}

export async function pullModel(model: string, onProgress: (ev: ProgressEvent) => void): Promise<ProgressEvent | null> {
  const chan = new Channel<ProgressEvent>();
  chan.onmessage = onProgress;

  return await invoke<ProgressEvent>("pull_model", {
    model,
    onPull: chan,
  });
}
