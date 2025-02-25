import type { IncomingUserPrompt } from "$lib/models/chat"
import { derived, writable } from "svelte/store"
import { selectedSessionModel } from "./models"

export const hidePromptBar = writable(false)

export const inputPrompt = writable<IncomingUserPrompt>({
  text: "",
})

export const isSubmittable = derived([inputPrompt, selectedSessionModel], ([$inputPrompt, $selectedSessionModel]) => {
  return ($inputPrompt.text.length > 0 || ($inputPrompt.imagePaths && $inputPrompt.imagePaths.length > 0)) && !!$selectedSessionModel
})
