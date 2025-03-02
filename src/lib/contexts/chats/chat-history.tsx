import { Accessor, createContext, createEffect, createMemo, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getCurrentBranch, switchBranch as switchBranchCommand } from "~/lib/commands/chat-history";
import { ChatBubble, ChatHistory } from "~/lib/models/session";
import { useChatSessions } from ".";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { createSession } from "~/lib/commands/sessions";
import { regenerateResponse, submitUserPrompt } from "~/lib/commands/chats";
import { convertResponseEvents } from "~/lib/utils/chat-streams";

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
  submit: (prompt: IncomingUserPrompt, model: string, evs?: PromptSubmissionEvents) => Promise<void>;
  regenerate: (chatId: number, model?: string, evs?: PromptSubmissionEvents) => Promise<void>;
  switchBranch: (chatId: number) => Promise<void>;
  editPrompt: (
    prompt: IncomingUserPrompt,
    chatId: number,
    model: string,
    evs?: PromptSubmissionEvents,
  ) => Promise<void>;
}

const ChatHistoryContext = createContext<ChatHistoryContextCollection>();

export type ChatHistoryStore = { chatHistory: ChatHistory | null };

export function ChatHistoryProvider(props: { children?: JSX.Element }) {
  const [chatHistoryStore, setChatHistoryStore] = createStore<ChatHistoryStore>({
    chatHistory: null,
  });

  const chatHistory = createMemo(() => chatHistoryStore.chatHistory);
  const lastChat = createMemo(() => chatHistory()?.chats.at(-1));

  const chatSessionsContext = useChatSessions();

  createEffect(() => {
    const sessions = chatSessionsContext?.sessions;
    const curSessionId = chatHistory()?.session;

    if (curSessionId !== undefined && !sessions?.find((s) => s.id === curSessionId)) {
      setChatHistoryStore("chatHistory", null);
    }
  });

  const reload = async () => {
    const ch = chatHistory();
    if (!ch) {
      return;
    }

    const sessionId = ch.session;
    setChatHistoryStore("chatHistory", "loading", true);

    try {
      const chats = await getCurrentBranch(sessionId);
      setChatHistoryStore("chatHistory", "chats", chats);
    } finally {
      setChatHistoryStore("chatHistory", "loading", false);
    }
  };

  const switchToSession = async (sessionId: number | null) => {
    setChatHistoryStore(
      "chatHistory",
      sessionId === null
        ? null
        : {
            session: sessionId,
            chats: [],
            loading: false,
          },
    );

    await reload();
  };

  const clear = async () => {
    await switchToSession(null);
  };

  const submit = async (
    prompt: IncomingUserPrompt,
    model: string,
    { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  ) => {
    let ch = chatHistory();
    if (!ch) {
      // TODO: Add settings option for default session name: 1) no name, 2) first prompt, 3) generated after first response
      // Currently it is `first prompt`
      const sessionTitle = prompt.text.split("\n").at(0);
      const session = await createSession(model, sessionTitle);

      await chatSessionsContext?.reloadSession(session.id);
      await switchToSession(session.id);

      ch = chatHistory()!;
    }

    const parentId = lastChat()?.id;

    let ctx = {
      responseIndex: -1,
    };

    const ret = await submitUserPrompt(
      ch.session,
      prompt,
      parentId === undefined ? null : parentId,
      convertResponseEvents(ctx, chatHistory, setChatHistoryStore, model, prompt, {
        onRespond,
        onScrollDown,
      }),
    );

    setChatHistoryStore("chatHistory", "chats", ctx.responseIndex, {
      status: "sent",
      dateSent: ret.dateCreated,
    });
  };

  const regenerate = async (
    chatId: number,
    model?: string,
    { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  ) => {
    const ch = chatHistory();
    if (!ch) {
      return;
    }

    let ctx = {
      responseIndex: -1,
    };

    const ret = await regenerateResponse(
      ch.session,
      chatId,
      model,
      convertResponseEvents(
        ctx,
        chatHistory,
        setChatHistoryStore,
        model,
        undefined,
        {
          onRespond,
          onScrollDown,
        },
        {
          regenerateFor: chatId,
        },
      ),
    );

    if (ctx.responseIndex >= 0) {
      setChatHistoryStore("chatHistory", "chats", ctx.responseIndex, {
        status: "sent",
        dateSent: ret.dateCreated,
      });
    }
  };

  const switchBranch = async (chatId: number) => {
    const [parentId, subbranch] = await switchBranchCommand(chatId);

    const ch = chatHistory();
    if (!ch) {
      return;
    }

    const index = parentId !== null ? ch.chats.findIndex((chat) => chat.id === parentId) + 1 : 0;
    if (index >= 0) {
      setChatHistoryStore("chatHistory", "chats", (chats) => [...chats.slice(0, index), ...subbranch]);
    }
  };

  const editPrompt = async (
    prompt: IncomingUserPrompt,
    chatId: number,
    model: string,
    { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  ) => {
    const ch = chatHistory();
    if (!ch) {
      throw new Error("No chat history.");
    }

    const curIndex = ch.chats.findIndex((value) => value.id === chatId);
    if (curIndex < 0) {
      throw new Error("Original chat not found.");
    }

    const parentId = curIndex === 0 ? null : ch.chats[curIndex - 1].id;

    let ctx = {
      responseIndex: -1,
    };

    const ret = await submitUserPrompt(
      ch.session,
      prompt,
      parentId,
      convertResponseEvents(
        ctx,
        chatHistory,
        setChatHistoryStore,
        model,
        prompt,
        { onRespond, onScrollDown },
        { regenerateFor: ch.chats[curIndex].id },
      ),
    );

    if (ctx.responseIndex >= 0) {
      setChatHistoryStore("chatHistory", "chats", ctx.responseIndex, {
        status: "sent",
        dateSent: ret.dateCreated,
      });
    }
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        chatHistory: chatHistoryStore.chatHistory,
        lastChat,
        reload,
        switchToSession,
        clear,
        submit,
        regenerate,
        switchBranch,
        editPrompt,
      }}
    >
      {props.children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  return useContext(ChatHistoryContext);
}
