import { getDefaultModel, listRunningModels, setDefaultModel } from "$lib/commands/models"
import type { RunningModel } from "$lib/models/model-item"
import { writable } from "svelte/store"

const internalDefaultModel = writable<string | undefined>()

export const defaultModel = {
  subscribe: internalDefaultModel.subscribe,
  async reload() {
    internalDefaultModel.set(await getDefaultModel())
  },
  async set(newModel: string) {
    await setDefaultModel(newModel)
    internalDefaultModel.set(newModel)
  },
}

export const currentModel = writable<string | undefined>()

const internalActiveModels = writable<RunningModel[]>([])

export const activeModels = {
  subscribe: internalActiveModels.subscribe,
  async reload() {
    const result = await listRunningModels()
    internalActiveModels.set(result)
  },
}
