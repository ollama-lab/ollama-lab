import { Accessor, Component, createContext, JSX, useContext } from "solid-js";
import { SessionMode } from "../models/session";

const SessionModeContext = createContext<Accessor<SessionMode>>(() => "normal" as SessionMode);

export const SessionModeProvider: Component<{
  value: SessionMode,
  children?: JSX.Element,
}> = (props) => {
  const value = () => props.value;

  return (
    <SessionModeContext.Provider value={value}>
      {props.children}
    </SessionModeContext.Provider>
  );
};

export function useSessionMode() {
  return useContext(SessionModeContext);
}
