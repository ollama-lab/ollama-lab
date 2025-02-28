import { listLocalModels } from "$lib/commands/models"
import type { ModelListItem } from "$lib/models/model-item"
import { toast } from "svelte-sonner"
import { derived, get, writable } from "svelte/store"
import { activeModels, defaultModel } from "./models"

const internalStatus = writable<"unfetched" | "fetching" | "error" | "fetched">("unfetched")

const internalList = writable<ModelListItem[]>([])

export const modelListStatus = derived(internalStatus, ($s, set) => set($s))

export const modelList = {
  subscribe: internalList.subscribe,
  async init() {
    if (get(internalStatus) === "unfetched") {
      await this.reload()
    }
  },
  async reload() {
    internalStatus.set("fetching")

    await listLocalModels()
      .then(result => {
        internalList.set(result)
        internalStatus.set("fetched")
      })
      .catch((err) => {
        toast.error(err)
        internalStatus.set("error")
      })

    await activeModels.reload()
    await defaultModel.reload()
  },
}
