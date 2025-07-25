import { createStore } from "solid-js/store";
import { Settings } from "../../schemas/settings";
import { getSettings as getSettingsCommand, setSettings as setSettingsCommand } from "../../commands/settings";
import { createEffect, createSignal } from "solid-js";
import { setColorMode } from "./color-mode";
import { isDev } from "solid-js/web";

export const DEFAULT_H2H = isDev;

const [settingsStore, setSettingsStore] = createStore<Settings>({
  appearance: {
    "color-mode": "system",
    dark: null,
    light: null,
  },
  ollama: {
    uri: null,
  },
  h2h: null,
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
  setRestartVotes((cur) => cur.filter((k) => k !== id));
}

export { restartVotes, setSettingsStore as setCurrentSettings };

export function isH2hEnabled() {
  return getCurrentSettings().h2h ?? DEFAULT_H2H;
}
