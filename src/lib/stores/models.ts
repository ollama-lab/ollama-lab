import type { Model, RunningModel } from "$lib/models/models"
import { readable } from "svelte/store"
import { listModels, listRunningModels } from "$lib/utils/commands"
import refreshable from "./refreshable"

export const modelList = refreshable<Model[]>([], async set => set(await listModels()))

export const runningModels = readable<RunningModel[]>([], set => {
  listRunningModels().then(res => set(res))

  const interval = setInterval(async () => {
    set(await listRunningModels())
  }, 10_000)

  return () => {
    clearInterval(interval)
  }
})
