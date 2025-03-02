import { Accessor, createContext, createSignal, JSX, Setter, useContext } from "solid-js";

const CurrentModelContext = createContext<[Accessor<string | null>, Setter<string | null>]>();

export function ModelPageCurrentModelProvider(props: { children?: JSX.Element }) {
  const [currentModel, setCurrentModel] = createSignal<string | null>(null);

  return (
    <CurrentModelContext.Provider value={[currentModel, setCurrentModel]}>
      {props.children}
    </CurrentModelContext.Provider>
  );
}

export function useModelPageCurrentModel() {
  return useContext(CurrentModelContext);
}
