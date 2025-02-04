import { getSettings, setSettings } from "$lib/commands/settings"
import type { Settings } from "$lib/models/settings"
import { get, writable, type Updater } from "svelte/store"
import { setMode } from "mode-watcher"

const internalSettings = writable<Settings>()

export const settings = {
  subscribe: internalSettings.subscribe,
  async reload() {
    const settings = await getSettings()
    internalSettings.set(settings)
    setMode(settings.appearance["color-mode"])
  },
  async set(newSettings: Settings) {
    internalSettings.set(await setSettings(newSettings))
  },
  async update(updater: Updater<Settings>) {
    await this.set(updater(get(internalSettings)))
  },
  get<T>(key: string, subkey: string): T {
    // @ts-expect-error
    return get(internalSettings)[key][subkey]
  },
  setItem<T>(key: string, subkey: string, value: T): void {
    internalSettings.update(v => {
      // @ts-expect-error
      v[key][subkey] = value
      return v 
    })
  },
}
