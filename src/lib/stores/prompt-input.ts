import type { IncomingUserPrompt } from "$lib/models/chat"
import { writable } from "svelte/store"

export const hidePromptBar = writable(false)

export const inputPrompt = writable<IncomingUserPrompt>({
  text: "",
})
