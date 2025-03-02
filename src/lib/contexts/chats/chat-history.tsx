import { Accessor, createContext, createMemo, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getCurrentBranch } from "~/lib/commands/chat-history";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { ChatBubble } from "~/lib/models/session";

export interface ChatHistory {
  session: number;
  chats: ChatBubble[];
  loading: boolean;
}

export interface PromptSubmissionEvents {
  onRespond?: () => void;
  onScrollDown?: () => void;
}

interface ChatHistoryContextCollection {
  chatHistory: ChatHistory | null;
  lastChat: Accessor<ChatBubble | undefined>;
  reload: () => Promise<void>;
  switchToSession: (sessionId: number | null) => Promise<void>;
  clear: () => Promise<void>;
  submit: (prompt: IncomingUserPrompt, evs?: PromptSubmissionEvents) => Promise<void>;
  regenerate: (chatId: number, model?: string, evs?: PromptSubmissionEvents) => Promise<void>;
  switchBranch: (chatId: number) => Promise<void>;
  editPrompt: (prompt: IncomingUserPrompt, chatId: number, evs?: PromptSubmissionEvents) => Promise<void>;
}

const ChatHistoryContext = createContext<ChatHistoryContextCollection>();

export function ChatHistoryProvider(props: { children?: JSX.Element }) {
  const [chatHistoryStore, setChatHistoryStore] = createStore<{ chatHistory: ChatHistory | null }>({
    chatHistory: null,
  });

  const lastChat = createMemo(() => chatHistoryStore.chatHistory?.chats.at(-1));

  const modelListContext = useModel

  const reload = async () => {
    if (!chatHistoryStore.chatHistory) {
      return;
    }

    const sessionId = chatHistoryStore.chatHistory.session;
    setChatHistoryStore("chatHistory", "loading", true);

    try {
      const chats = await getCurrentBranch(sessionId);
      setChatHistoryStore("chatHistory", "chats", chats);
    } finally {
      setChatHistoryStore("chatHistory", "loading", false);
    }
  };

  const switchToSession = async (sessionId: number | null) => {
    setChatHistoryStore("chatHistory", sessionId === null ? null : {
      session: sessionId,
      chats: [],
      loading: false,
    });

    await reload();
  };

  const clear = async () => {
    await switchToSession(null);
  };

  const submit = async (prompt: IncomingUserPrompt, {
    onRespond,
    onScrollDown,
  }: PromptSubmissionEvents = {}) => {
  };

  return (
    <ChatHistoryContext.Provider value={{
      chatHistory: chatHistoryStore.chatHistory,
      lastChat,
      reload,
      switchToSession,
      clear,
      submit,
      regenerate,
      switchBranch,
      editPrompt,
    }}>
      {props.children}
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  return useContext(ChatHistoryContext);
}
