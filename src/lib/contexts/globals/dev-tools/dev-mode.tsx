import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { isDev } from "solid-js/web";

const [devModeEnabled, setDevModeEnabled] = createSignal(isDev);

export interface DevOptionsStore {
  rerenderFlash: boolean;
}

const [devOptions, setDevOptions] = createStore<DevOptionsStore>({
  rerenderFlash: false,
});

export function getDevOptions(key: string) {
  if (!devModeEnabled()) {
    return undefined;
  }

  return (devOptions as unknown as Record<string, boolean>)[key];
}

export { devModeEnabled, setDevModeEnabled, setDevOptions };
