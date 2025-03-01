import { createContext, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { getSettings, setSettings } from "~/lib/commands/settings";
import { Settings } from "~/lib/models/settings";

interface SettingsStore {
  settings?: Settings;
}

export interface SettingsContextOps {
  reload: () => Promise<void>;
  save: (newSettings?: Settings) => Promise<void>;
  set: SetStoreFunction<SettingsStore>;
}

type SettingsContextTuple = [SettingsStore, SettingsContextOps];

const SettingsContext = createContext<SettingsContextTuple>();

export function SettingsProvider(props: { children?: JSX.Element }) {
  const [store, setStore] = createStore<SettingsStore>({
    settings: undefined
  });

  const reload = async () => {
    setStore({
      settings: await getSettings(),
    });
  }

  const save = async (newSettings?: Settings) => {
    const inputSettings = newSettings ?? store.settings;
    let retSettings: Settings | undefined = undefined;
    if (inputSettings) {
      retSettings = await setSettings(inputSettings);
    }

    if (retSettings) {
      setStore({
        settings: retSettings,
      });
    }
  }

  return (
    <SettingsContext.Provider value={[store, { reload, save, set: setStore }]}>
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
