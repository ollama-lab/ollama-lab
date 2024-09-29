import { writable } from "svelte/store"

export default function refreshable<T>(value?: T, updater?: (set: (value: T) => void) => Promise<void>) {
  const { subscribe, set } = writable<T>(value)
  updater?.call(null, set)

  return {
    subscribe,
    refresh: () => updater?.call(null, set),
  }
}
