import { modelListItemSchema, runningModelSchema, type ModelInfo, type ModelListItem, type RunningModel } from "~/lib/schemas/model-item";
import { Channel, invoke } from "@tauri-apps/api/core";
import { ProgressEvent } from "../schemas/events/progress";
import { z } from "zod";

const listLocalModelsResponseSchema = z.object({
  models: z.array(modelListItemSchema),
});

export async function listLocalModels(): Promise<ModelListItem[]> {
  return listLocalModelsResponseSchema.parse(await invoke("list_local_models")).models;
}

const listRunningModelsResponseSchema = z.object({
  models: z.array(runningModelSchema),
});

export async function listRunningModels(): Promise<RunningModel[]> {
  return listRunningModelsResponseSchema.parse(await invoke("list_running_models")).models;
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
