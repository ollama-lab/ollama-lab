import { writable } from "svelte/store"

export const defaultModel = writable<string | undefined>()
