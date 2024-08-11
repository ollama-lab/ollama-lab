import type { Model, RunningModel } from "$lib/models/models"
import { readable, readonly, writable } from "svelte/store"
import { listModels, listRunningModels } from "$lib/utils/commands"

const internalModelList = writable<Model[]>([], set => {
  listModels()
    .then(models => set(models))
})

export const modelList = readonly(internalModelList)

export async function refreshModelList() {
  internalModelList.set(await listModels())
}

export const runningModels = readable<RunningModel[]>([], set => {
  listRunningModels().then(res => set(res))

  const interval = setInterval(async () => {
    set(await listRunningModels())
  }, 20_000)

  return () => {
    clearInterval(interval)
  }
})
