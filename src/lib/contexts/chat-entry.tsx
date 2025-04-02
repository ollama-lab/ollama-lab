import { Accessor, createContext, JSX, useContext } from "solid-js";
import { Chat } from "../schemas/session";

const ChatEntryContext = createContext<Accessor<Chat>>();

export interface ChatEntryProviderProps {
  children?: JSX.Element;
  value: Accessor<Chat>;
}

export function ChatEntryProvider(props: ChatEntryProviderProps) {
  const value = () => props.value();

  return (
    <ChatEntryContext.Provider value={value}>
      {props.children}
    </ChatEntryContext.Provider>
  );
}

export function useChatEntry() {
  return useContext(ChatEntryContext);
}
