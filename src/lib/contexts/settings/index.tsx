import { Accessor, createContext, createEffect, createMemo, createSignal, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { getSettings, setSettings } from "~/lib/commands/settings";
import { Settings } from "~/lib/models/settings";
import { useColorMode } from "../color-mode";

export interface SettingsContextContent {
  settings: Accessor<Settings>;
  restartVotes: Accessor<string[]>;
  voteRestart: (id: string) => void;
  unvoteRestart: (id: string) => void;
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

  const [restartVotes, setRestartVotes] = createSignal<string[]>([]);

  const reload = async () => {
    const settings = await getSettings();
    setSettingsStore(settings);
  };

  const save = async () => {
    await setSettings(settingsStore);
  };

  const colorModeContext = useColorMode();
  const currentColorMode = createMemo(() => settingsStore.appearance["color-mode"]);

  createEffect(() => {
    const current = currentColorMode();
    if (current) {
      colorModeContext?.setColorMode(current);
    }
  });

  createEffect(() => reload());

  return (
    <SettingsContext.Provider
      value={{
        settings: () => settingsStore,
        restartVotes,
        voteRestart: (id) => setRestartVotes((cur) => [...cur.filter((k) => k !== id), id]),
        unvoteRestart: (id) => setRestartVotes((cur) => cur.filter((k) => k !== id)),
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
