import { createStore } from "solid-js/store";
import type { ChatHistory } from "~/lib/models/session";
import { createEffect, createMemo } from "solid-js";
import { getAllSessions, reloadSession } from "./sessions";
import { getCurrentBranch } from "~/lib/commands/chat-history";
import { IncomingUserPrompt } from "~/lib/models/chat";
import { createSession } from "~/lib/commands/sessions";
import { regenerateResponse, submitUserPrompt } from "~/lib/commands/chats";
import { convertResponseEvents } from "~/lib/utils/chat-streams";
import { switchBranch as switchBranchCommand } from "~/lib/commands/chat-history";

export interface PromptSubmissionEvents {
  onRespond?: () => void;
  onScrollDown?: () => void;
}

export interface ChatHistoryStore {
  chatHistory: ChatHistory | null;
}

const [chatHistoryStore, setChatHistoryStore] = createStore<ChatHistoryStore>({
  chatHistory: null,
});

export function getChatHistory() {
  return chatHistoryStore.chatHistory;
}

const lastChat = createMemo(() => getChatHistory()?.chats.at(-1));

createEffect(() => {
  const sessions = getAllSessions();
  const curSession = getChatHistory()?.session;

  if (curSession !== undefined && !sessions.find((s) => s.id === curSession)) {
    setChatHistoryStore("chatHistory", null);
  }
});

export async function reloadChatHistory() {
  const ch = getChatHistory();
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
}

export async function switchToSession(sessionId: number | null) {
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
}

export async function clearChatHistory() {
  await switchToSession(null);
}

export async function submitChat(
  prompt: IncomingUserPrompt,
  model: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
) {
  let ch = getChatHistory();
  if (!ch) {
    // TODO: Add settings option for default session name: 1) no name, 2) first prompt, 3) generated after first response
    // Currently it is `first prompt`
    const sessionTitle = prompt.text.split("\n").at(0);
    const session = await createSession(model, sessionTitle);

    await reloadSession(session.id);
    await switchToSession(session.id);

    ch = getChatHistory()!;
  }

  const parentId = lastChat()?.id;

  const ctx = {
    responseIndex: -1,
  };

  const ret = await submitUserPrompt(
    ch.session,
    prompt,
    parentId === undefined ? null : parentId,
    convertResponseEvents(ctx, getChatHistory, setChatHistoryStore, model, prompt, {
      onRespond,
      onScrollDown,
    }),
  );

  setChatHistoryStore("chatHistory", "chats", ctx.responseIndex, {
    status: "sent",
    dateSent: ret.dateCreated,
  });
}

export async function regenerate(
  chatId: number,
  model?: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
) {
  const ch = getChatHistory();
  if (!ch) {
    return;
  }

  const ctx = {
    responseIndex: -1,
  };

  const ret = await regenerateResponse(
    ch.session,
    chatId,
    model,
    convertResponseEvents(
      ctx,
      getChatHistory,
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
}

export async function switchBranch(chatId: number) {
  const [parentId, subbranch] = await switchBranchCommand(chatId);

  const ch = getChatHistory();
  if (!ch) {
    return;
  }

  const index = parentId !== null ? ch.chats.findIndex((chat) => chat.id === parentId) + 1 : 0;
  if (index >= 0) {
    setChatHistoryStore("chatHistory", "chats", (chats) => [...chats.slice(0, index), ...subbranch]);
  }
}

export async function editPrompt(
  prompt: IncomingUserPrompt,
  chatId: number,
  model: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
) {
  const ch = getChatHistory();
  if (!ch) {
    throw new Error("No chat history.");
  }

  const curIndex = ch.chats.findIndex((value) => value.id === chatId);
  if (curIndex < 0) {
    throw new Error("Original chat not found.");
  }

  const parentId = curIndex === 0 ? null : ch.chats[curIndex - 1].id;

  const ctx = {
    responseIndex: -1,
  };

  const ret = await submitUserPrompt(
    ch.session,
    prompt,
    parentId,
    convertResponseEvents(
      ctx,
      getChatHistory,
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
}
