import { Accessor, createContext, JSX, Setter, useContext } from "solid-js";

export interface EditModeContextModel {
  get: Accessor<boolean>,
  set: Setter<boolean>,
}

const EditModeContext = createContext<EditModeContextModel>();

export interface EditModeProviderProps {
  accessor: Accessor<boolean>;
  setter: Setter<boolean>;
  children?: JSX.Element;
}

export function EditModeProvider(props: EditModeProviderProps) {
  const get: Accessor<boolean> = () => props.accessor();
  const set: Setter<boolean> = (value) => props.setter(value);

  return (
    <EditModeContext.Provider value={{ get, set }}>
      {props.children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
