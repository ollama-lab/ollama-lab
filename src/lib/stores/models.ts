import type { Model, RunningModel } from "$lib/models/models"
import { readable, readonly, writable } from "svelte/store"
import { listModels } from "$lib/utils/commands"

const internalModelList = writable<Model[]>([], set => {
  listModels()
    .then(models => set(models))
    .catch(err => console.error(err))
})

export const modelList = readonly(internalModelList)

export async function refreshModelList() {
  internalModelList.set(await listModels())
}

export const runningModels = readable<RunningModel[]>([])
