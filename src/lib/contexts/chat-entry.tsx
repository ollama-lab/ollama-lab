import { Accessor, createContext, JSX, useContext } from "solid-js";
import { ChatBubble } from "../models/session";

const ChatEntryContext = createContext<Accessor<ChatBubble>>();

export interface ChatEntryProviderProps {
  children?: JSX.Element;
  value: Accessor<ChatBubble>;
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
