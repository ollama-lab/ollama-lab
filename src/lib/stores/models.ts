import { getDefaultModel, listRunningModels, setDefaultModel } from "$lib/commands/models"
import type { RunningModel } from "$lib/models/model-item"
import { derived, get, writable } from "svelte/store"
import { sessions } from "./sessions"
import { chatHistory } from "./chats"
import { setSessionModel } from "$lib/commands/sessions"

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

const candidateSessionModel = writable<string | undefined>()

const internalSelectedSessionModel = derived([candidateSessionModel, sessions, chatHistory], ([$csm, $s, $ch]) => {
  if ($s && $ch) {
    return $s.find(session => session.id === $ch.session)?.currentModel
  }

  return $csm
})

export const selectedSessionModel = {
  subscribe: internalSelectedSessionModel.subscribe,
  async set(value: string): Promise<void> {
    const s = get(sessions)
    const ch = get(chatHistory)

    if (s && ch) {
      await setSessionModel(ch.session, value)
      await sessions.reloadSession(ch.session)
      candidateSessionModel.set(undefined)
    } else {
      candidateSessionModel.set(value)
    }
  },
}

export const usingSystemPrompt = writable(true)
