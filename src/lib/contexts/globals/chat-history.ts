import { createStore } from "solid-js/store";
import type { Chat, ChatHistory, SessionMode } from "~/lib/models/session";
import { createMemo } from "solid-js";
import { reloadSession } from "./sessions";
import { getCurrentBranch } from "~/lib/commands/chat-history";
import { EditUserPrompt, IncomingUserPrompt } from "~/lib/models/chat";
import { createSession } from "~/lib/commands/sessions";
import { regenerateResponse, submitUserPrompt } from "~/lib/commands/chats";
import { convertResponseEvents } from "~/lib/utils/chat-streams";
import { switchBranch as switchBranchCommand } from "~/lib/commands/chat-history";
import { currentSession, setCurrentSessionId, setNewSession } from "./current-session";
import { getCurrentModel } from "./current-model";
import { setCandidate } from "./candidate-model";
import { getCandidateSessionSystemPrompt, setCandidateSessionSystemPrompt } from "./candidate-session-system-prompt";
import { isH2h } from "./settings";

export interface PromptSubmissionEvents {
  onRespond?: () => void;
  onScrollDown?: () => void;
}

export interface ChatHistoryStore {
  chatHistory: Record<SessionMode, ChatHistory | undefined>;
  loading: boolean;
}

const [chatHistoryStore, setChatHistoryStore] = createStore<ChatHistoryStore>({
  chatHistory: { normal: undefined, h2h: undefined },
  loading: false,
});

export const getChatHistoryStore = () => chatHistoryStore;

export function getChatHistory(mode: SessionMode = "normal") {
  return chatHistoryStore.chatHistory[mode];
}

const lastChat = createMemo(() => {
  return Object.entries(chatHistoryStore.chatHistory).reduce((acc, [key, value]) => {
    acc[key] = value?.chats.at(-1);
    return acc;
  }, {} as Record<string, Chat | undefined>);
});

export async function reloadChatHistory(mode: SessionMode = "normal") {
  const session = currentSession();
  if (session) {
    setChatHistoryStore("loading", true);
    const result = await getCurrentBranch(session.id);
    setChatHistoryStore("chatHistory", mode, {
      chats: result,
    });
    setChatHistoryStore("loading", false);
  } else {
    setChatHistoryStore("chatHistory", mode, undefined);
  }
}

export async function clearChatHistory(reserveSelectedModel?: boolean, mode: SessionMode = "normal") {
  const selected = reserveSelectedModel ? getCurrentModel(mode) : undefined;

  setCurrentSessionId(null);

  if (reserveSelectedModel && selected) {
    setCandidate(selected);
  }
}

export async function submitChat(
  prompt: IncomingUserPrompt,
  model: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  mode: SessionMode = "normal",
) {
  let session = currentSession() ?? undefined;
  if (!session) {
    // TODO: Add settings option for default session name: 1) no name, 2) first prompt, 3) generated after first response
    // Currently it is `first prompt`
    let sessionTitle = prompt.text.split("\n").at(0) ?? null;
    if ((!sessionTitle || sessionTitle.length < 1) && prompt.imagePaths && prompt.imagePaths.length > 0) {
      sessionTitle = `Image${prompt.imagePaths.length > 1 ? "s" : ""}`;
    }

    const sessionSystemPrompt = isH2h() ? getCandidateSessionSystemPrompt() : undefined;

    session = await createSession(model, sessionTitle, mode);

    await reloadSession(session.id);
    await setNewSession(session.id);

    if (sessionSystemPrompt) {
      await setCandidateSessionSystemPrompt(sessionSystemPrompt, session.id);
    }
  }

  const parentId = lastChat()[mode]?.id;

  const ret = await submitUserPrompt(
    session?.id,
    prompt,
    parentId === undefined ? null : parentId,
    convertResponseEvents(getChatHistory.bind(getChatHistory, mode), setChatHistoryStore, model, prompt, {
      onRespond,
      onScrollDown,
    }, undefined, mode),
    true,
    mode,
  );

  setChatHistoryStore("chatHistory", mode, "chats", getChatHistory()!.chats.length - 1, {
    status: "sent",
    dateSent: ret.dateCreated,
  });
}

export async function regenerate(
  chatId: number,
  model?: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  mode: SessionMode = "normal",
) {
  const session = currentSession();
  if (!session) {
    return;
  }

  const ret = await regenerateResponse(
    session.id,
    chatId,
    model,
    convertResponseEvents(
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
      mode,
    ),
  );

  setChatHistoryStore("chatHistory", mode, "chats", getChatHistory()!.chats.length - 1, {
    status: "sent",
    dateSent: ret.dateCreated,
  });
}

export async function switchBranch(chatId: number, mode: SessionMode = "normal") {
  const [parentId, subbranch] = await switchBranchCommand(chatId);

  const ch = getChatHistory();
  if (!ch) {
    return;
  }

  const index = parentId !== null ? ch.chats.findIndex((chat) => chat.id === parentId) + 1 : 0;
  if (index >= 0) {
    setChatHistoryStore("chatHistory", mode, "chats", (chats) => [...chats.slice(0, index), ...subbranch]);
  }
}

export async function editPrompt(
  prompt: EditUserPrompt,
  chatId: number,
  model: string,
  { onRespond, onScrollDown }: PromptSubmissionEvents = {},
  mode: SessionMode = "normal",
) {
  const session = currentSession();
  if (!session) {
    return;
  }

  const ch = getChatHistory();
  if (!ch) {
    throw new Error("No chat history.");
  }

  const curIndex = ch.chats.findIndex((value) => value.id === chatId);
  if (curIndex < 0) {
    throw new Error("Original chat not found.");
  }

  const parentId = curIndex === 0 ? null : ch.chats[curIndex - 1].id;

  const curPrompt: IncomingUserPrompt = {
    text: ch.chats[curIndex].content,
  };

  const mergedPrompt: IncomingUserPrompt = { ...curPrompt, ...prompt };

  const ret = await submitUserPrompt(
    session.id,
    mergedPrompt,
    parentId,
    convertResponseEvents(
      getChatHistory,
      setChatHistoryStore,
      model,
      mergedPrompt,
      { onRespond, onScrollDown },
      { regenerateFor: ch.chats[curIndex].id },
      mode,
    ),
    true,
  );

  setChatHistoryStore("chatHistory", mode, "chats", getChatHistory()!.chats.length - 1, {
    status: "sent",
    dateSent: ret.dateCreated,
  });
}
