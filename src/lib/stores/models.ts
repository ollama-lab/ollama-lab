import type { Model, RunningModel } from "$lib/models/models"
import { derived, readable, writable } from "svelte/store"
import { currentSession, sessionList } from "./sessions"
import { listModels } from "$lib/utils/commands"

export const modelList = writable<Model[]>([], set => {
  listModels()
    .then(models => set(models))
    .catch(err => console.error(err))
})

export const runningModels = readable<RunningModel[]>([])

export const currentModel = derived([modelList, sessionList, currentSession], ([$m, $s, $cs]) => {
  return $m.length ? $m[$cs ? ($s.find(item => item.id === $cs)?.id ?? 0) : 0] : null
})
