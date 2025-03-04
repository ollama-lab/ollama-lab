import { createStore } from "solid-js/store";
import { Settings } from "../models/settings";
import { getSettings as getSettingsCommand, setSettings as setSettingsCommand } from "../commands/settings";
import { createEffect, createSignal } from "solid-js";
import { setColorMode } from "./color-mode";

const [settingsStore, setSettingsStore] = createStore<Settings>({
  appearance: {
    "color-mode": "system",
    dark: null,
    light: null,
  },
  ollama: {
    uri: null,
  },
});

const [restartVotes, setRestartVotes] = createSignal<string[]>([]);

export async function reloadSettings() {
  return setSettingsStore(await getSettingsCommand());
}

export async function saveSettings() {
  await setSettingsCommand(settingsStore);
}

createEffect(() => {
  const current = settingsStore.appearance["color-mode"]; 
  if (current) {
    setColorMode(current);
  }
});

createEffect(() => reloadSettings());

export function getCurrentSettings() {
  return settingsStore;
}

export function voteRestart(id: string) {
  setRestartVotes((cur) => [...cur.filter((k) => k !== id), id]);
}

export function unvoteRestart(id: string) {
  setRestartVotes((cur) => cur.filter((k) => k !== id))
}

export { restartVotes, setSettingsStore as setCurrentSettings };
