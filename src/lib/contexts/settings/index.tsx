import { createContext, createEffect, createMemo, createSignal, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { getSettings, setSettings } from "~/lib/commands/settings";
import { Settings } from "~/lib/models/settings";
import { useColorMode } from "../color-mode";

export interface SettingsContextContent {
  settings: Settings;
  restartVotes: number;
  voteRestart: () => void;
  unvoteRestart: () => void;
  set: SetStoreFunction<Settings>;
  save: () => Promise<void>;
  reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextContent>();

export function SettingsProvider(props: { children?: JSX.Element }) {
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

  const [restartVotes, setRestartVotes] = createSignal(0);

  const reload = async () => {
    const settings = await getSettings();
    setSettingsStore(settings);
  };

  const save = async () => {
    await setSettings(settingsStore);
  };

  const [_, setColorMode] = useColorMode();
  const currentColorMode = createMemo(() => settingsStore.appearance["color-mode"]);

  createEffect(() => {
    const current = currentColorMode();
    if (current) {
      setColorMode(current);
    }
  });

  createEffect(() => reload());

  return (
    <SettingsContext.Provider
      value={{
        settings: settingsStore,
        restartVotes: restartVotes(),
        voteRestart: () => setRestartVotes((cur) => cur + 1),
        unvoteRestart: () => setRestartVotes((cur) => cur - 1),
        reload,
        set: setSettingsStore,
        save,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
