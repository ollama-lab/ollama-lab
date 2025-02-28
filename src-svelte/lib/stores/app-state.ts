import { writable } from "svelte/store"

export interface FrontendState {
  initialized: boolean
}

export const frontendState = writable<FrontendState>({
  initialized: false,
})
