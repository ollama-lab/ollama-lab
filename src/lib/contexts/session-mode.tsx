import { Accessor, Component, createContext, JSX, useContext } from "solid-js";
import { SessionMode, sessionModeSchema } from "../schemas/session";

const SessionModeContext = createContext<Accessor<SessionMode>>(() => sessionModeSchema.parse(undefined));

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
