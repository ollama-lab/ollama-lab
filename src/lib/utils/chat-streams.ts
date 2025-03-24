import type { PromptResponseEvents } from "~/lib/commands/chats";
import type { IncomingUserPrompt } from "~/lib/models/chat";
import { emit } from "@tauri-apps/api/event";
import { toast } from "solid-sonner";
import { Accessor } from "solid-js";
import { ChatHistory, SessionMode } from "../models/session";
import { reconcile, SetStoreFunction } from "solid-js/store";
import { ChatHistoryStore, PromptSubmissionEvents } from "../contexts/globals/chat-history";

export interface ConvertResponseEventsProps {
  regenerateFor?: number;
}

export function convertResponseEvents(
  chatHistory: Accessor<ChatHistory | undefined>,
  setChatHistoryStore: SetStoreFunction<ChatHistoryStore>,
  mode: SessionMode,
  model?: string,
  prompt?: IncomingUserPrompt,
  { onScrollDown, onRespond }: PromptSubmissionEvents = {},
  { regenerateFor }: ConvertResponseEventsProps = {},
): PromptResponseEvents {
  let currentChatId: number | undefined = undefined;

  function getOrCreateHistory() {
    const ch = chatHistory();
    if (!ch) {
      setChatHistoryStore("chatHistory", mode, { chats: [] });
    }

    return chatHistory()!;
  }

  return {
    afterUserPromptSubmitted(id: number, date: Date): void {
      const ch = getOrCreateHistory();

      if (regenerateFor !== undefined) {
        const chatIndex = ch.chats.findIndex((value) => value.id === regenerateFor);
        if (chatIndex >= 0) {
          const versions = ch.chats[chatIndex].versions;

          setChatHistoryStore(
            "chatHistory",
            mode,
            "chats",
            reconcile([
              ...ch.chats.slice(0, chatIndex),
              {
                ...ch.chats[chatIndex],
                id,
                model: model ?? ch.chats[chatIndex].model,
                status: "sent",
                content: prompt?.text ?? "",
                dateSent: date,
                versions: versions ? [...versions, id] : [ch.chats[chatIndex].id, id],
              },
            ]),
          );
        }
        regenerateFor = undefined;
      } else {
        setChatHistoryStore("chatHistory", mode, "chats", ch.chats.length, {
          id,
          status: "sent",
          content: prompt?.text ?? "",
          role: "user",
          dateSent: date,
          versions: [id],
          imageCount: prompt?.imagePaths?.length ?? 0,
        });
      }

      onScrollDown?.();
    },
    afterResponseCreated(id: number): void {
      currentChatId = id;

      const ch = getOrCreateHistory();

      if (regenerateFor !== undefined) {
        const i = ch.chats.findIndex((value) => value.id === regenerateFor);
        if (i < 0) {
          return;
        }

        const versions = ch.chats[i].versions;

        setChatHistoryStore(
          "chatHistory",
          mode,
          "chats",
          reconcile([
            ...ch.chats.slice(0, i),
            {
              ...ch.chats[i],
              id,
              status: "preparing",
              content: "",
              thoughts: null,
              model: model ?? ch.chats[i].model,
              versions: versions ? [...versions, id] : [ch.chats[i].id, id]
            },
          ]),
        );
      } else {
        const length = ch.chats.length;
        setChatHistoryStore("chatHistory", mode, "chats", length, {
          id,
          status: "preparing",
          role: "assistant",
          content: "",
          model,
          versions: [id],
          imageCount: 0,
        });
      }

      onRespond?.();
      onScrollDown?.();
    },
    afterSystemPromptCreated(id: number, text: string): void {
      const ch = getOrCreateHistory();

      setChatHistoryStore("chatHistory", mode, "chats", ch.chats.length, {
        id,
        content: text,
        role: "system",
        status: "sent",
        imageCount: 0,
      });
    },
    onStreamText(chunk: string): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      if (!chat || currentChatId !== chat.id) {
        emit("cancel-gen");
        return;
      }

      const index = ch.chats.length - 1;

      setChatHistoryStore("chatHistory", mode, "chats", index, "status", reconcile("sending"));

      if (chat.thinking) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "thoughts", (t) => (t ?? "") + chunk);
      } else {
        setChatHistoryStore("chatHistory", mode, "chats", index, "content", (t) => (t ?? "") + chunk);
      }

      onScrollDown?.();
    },
    onCompleteTextStreaming(): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "status", "sent");
      }

      currentChatId = undefined;
    },
    onFail(msg): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "status", "not sent");
      }

      currentChatId = undefined;

      if (msg) {
        toast.error(msg);
      }
    },
    onCancel(): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, "status", "not sent");
      }

      currentChatId = undefined;
    },
    onThoughtBegin(): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, {
          thinking: true,
          status: "sending",
        });
      }
    },
    onThoughtEnd(thoughtFor: number | null): void {
      const ch = getOrCreateHistory();

      const chat = ch.chats.at(-1);
      const index = ch.chats.length - 1;
      if (chat && chat.id === currentChatId) {
        setChatHistoryStore("chatHistory", mode, "chats", index, {
          thinking: false,
          thoughtFor: thoughtFor,
        });
      }
    },
  };
}
